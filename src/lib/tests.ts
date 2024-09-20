import { db } from './firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export interface Test {
  id: string
  name: string
  date: string
  score: string
}

export async function getTestsByTopicId(topicId: string): Promise<Test[]> {
  try {
    const testsRef = collection(db, 'tests')
    const q = query(testsRef, where('topicId', '==', topicId))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Test))
  } catch (error) {
    console.error('Error fetching tests:', error)
    throw error
  }
}