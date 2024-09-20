import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Question {
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

interface TestData {
  questions: Question[];
}

// Initialize the database connection
let db: any = null;

async function getDb() {
  if (!db) {
    const dbPath = path.resolve('./tests.db');
    console.log('Database path:', dbPath);
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topicId TEXT,
        createdAt TEXT,
        status TEXT,
        questionCount INTEGER
      );
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        testId INTEGER,
        text TEXT,
        options TEXT,
        correctAnswer TEXT,
        explanation TEXT,
        questionOrder INTEGER,
        FOREIGN KEY (testId) REFERENCES tests(id)
      );
    `);
  }
  return db;
}

export async function POST(req: Request) {
  try {
    const { topicId, topicTitle, topicDescription } = await req.json();

    console.log('1. Generating test for topic:', topicTitle);

    const prompt = `Generate a test for the topic "${topicTitle}". 
    Topic description: ${topicDescription}
    Create 5 multiple-choice questions with 4 options each. 
    Provide the correct answer and an explanation for each question.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4",
      messages: [{ role: "user", content: prompt }],
      functions: [
        {
          name: "generate_test",
          description: "Generate a test with multiple-choice questions",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string" },
                    options: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          text: { type: "string" }
                        },
                        required: ["id", "text"]
                      }
                    },
                    correctAnswer: { type: "string" },
                    explanation: { type: "string" }
                  },
                  required: ["text", "options", "correctAnswer", "explanation"]
                }
              }
            },
            required: ["questions"]
          }
        }
      ],
      function_call: { name: "generate_test" }
    });

    const functionCall = completion.choices[0].message.function_call;
    if (!functionCall || !functionCall.arguments) {
      throw new Error('Failed to generate test: No function call returned');
    }

    console.log('2. OpenAI response received');

    const testData: TestData = JSON.parse(functionCall.arguments);

    console.log('3. Parsed test data:', JSON.stringify(testData, null, 2));

    const db = await getDb();

    // Create a new test record
    const { lastID: testId } = await db.run(`
      INSERT INTO tests (topicId, createdAt, status, questionCount)
      VALUES (?, ?, ?, ?)
    `, [topicId, new Date().toISOString(), 'creating', testData.questions.length]);

    console.log('4. Created test record with ID:', testId);

    // Add questions as separate records and link them to the test
    for (let i = 0; i < testData.questions.length; i++) {
      const question = testData.questions[i];
      try {
        console.log(`5. Adding question ${i + 1} to SQLite`);
        const result = await db.run(`
          INSERT INTO questions (testId, text, options, correctAnswer, explanation, questionOrder)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [testId, question.text, JSON.stringify(question.options), question.correctAnswer, question.explanation, i + 1]);
        
        console.log(`6. Added question ${i + 1} to SQLite, last inserted ID:`, result.lastID);
      } catch (error) {
        console.error(`Error adding question ${i + 1} to SQLite:`, error);
      }
    }

    // Set test status to 'ready'
    await db.run(`
      UPDATE tests SET status = 'ready' WHERE id = ?
    `, [testId]);

    console.log('7. Test status set to ready');

    // Verify the inserted data
    const verifyTest = await db.get('SELECT * FROM tests WHERE id = ?', [testId]);
    console.log('8. Verified test:', verifyTest);

    const verifyQuestions = await db.all('SELECT * FROM questions WHERE testId = ?', [testId]);
    console.log('9. Verified questions:', verifyQuestions);

    return NextResponse.json({ testId, status: 'ready' });
  } catch (error: unknown) {
    console.error('Error generating test:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to generate test', details: errorMessage }, { status: 500 });
  }
}