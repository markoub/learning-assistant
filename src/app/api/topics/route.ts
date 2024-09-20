import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any = null;

async function getDb() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        color TEXT,
        documentsCount INTEGER,
        testsCount INTEGER,
        description TEXT,
        userId TEXT
      )
    `);
  }
  return db;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
  }

  const db = await getDb();
  const topics = await db.all('SELECT * FROM topics WHERE userId = ?', [userId]);
  return NextResponse.json(topics);
}

export async function POST(request: Request) {
  const topic = await request.json();
  const db = await getDb();
  const { lastID } = await db.run(
    'INSERT INTO topics (title, color, documentsCount, testsCount, description, userId) VALUES (?, ?, ?, ?, ?, ?)',
    [topic.title, topic.color, topic.documentsCount, topic.testsCount, topic.description, topic.userId]
  );
  return NextResponse.json({ id: lastID });
}