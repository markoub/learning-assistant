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
  }
  return db;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const db = await getDb();
  
  try {
    const topic = await db.get('SELECT * FROM topics WHERE id = ?', [id]);
    if (topic) {
      return NextResponse.json(topic);
    } else {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const updates = await request.json();
  const db = await getDb();
  
  try {
    const validUpdates = Object.entries(updates).filter(([_, value]) => value !== undefined);
    if (validUpdates.length > 0) {
      const setClause = validUpdates.map(([key, _]) => `${key} = ?`).join(', ');
      const values = validUpdates.map(([_, value]) => value);
      await db.run(`UPDATE topics SET ${setClause} WHERE id = ?`, [...values, id]);
    }
    return NextResponse.json({ message: 'Topic updated successfully' });
  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}