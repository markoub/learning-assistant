import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export interface Topic {
  id: string;
  title: string;
  color: string;
  documentsCount: number;
  testsCount: number;
  description?: string;
  userId: string;
}

export const addTopic = async (topic: Omit<Topic, 'id'>): Promise<string> => {
  const response = await fetch('/api/topics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(topic),
  });
  const data = await response.json();
  return data.id.toString();
};

export const getTopicsByUserId = async (userId: string): Promise<Topic[]> => {
  const response = await fetch(`/api/topics?userId=${userId}`);
  const topics = await response.json();
  return topics.map((topic: any) => ({ ...topic, id: topic.id.toString() }));
};

export async function getTopicById(topicId: string): Promise<Topic | null> {
  const response = await fetch(`/api/topics/${topicId}`);
  if (!response.ok) {
    return null;
  }
  const topic = await response.json();
  return { ...topic, id: topic.id.toString() };
}

export const updateTopic = async (id: string, updates: Partial<Omit<Topic, 'id'>>) => {
  const response = await fetch(`/api/topics/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update topic');
  }
};