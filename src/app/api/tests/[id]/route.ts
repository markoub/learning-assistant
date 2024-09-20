import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db: any = null;

async function getDb() {
  if (!db) {
    const dbPath = path.resolve('./tests.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  }
  return db;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const testId = params.id;
  const db = await getDb();

  try {
    const test = await db.get('SELECT * FROM tests WHERE id = ?', [testId]);
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    const questions = await db.all('SELECT * FROM questions WHERE testId = ? ORDER BY questionOrder', [testId]);

    return NextResponse.json({ test, questions });
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}