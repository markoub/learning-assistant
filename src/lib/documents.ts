import { db } from './firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export interface Document {
  id: string
  name: string
  uploadDate: string
}

export async function getDocumentsByTopicId(topicId: string): Promise<Document[]> {
  try {
    const documentsRef = collection(db, 'documents')
    const q = query(documentsRef, where('topicId', '==', topicId))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Document))
  } catch (error) {
    console.error('Error fetching documents:', error)
    throw error
  }
}