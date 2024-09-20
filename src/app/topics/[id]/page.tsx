"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Play, CheckCircle, Edit } from 'lucide-react'
import { getTopicById, Topic, updateTopic } from '@/lib/topics'
import { getDocumentsByTopicId, Document } from '@/lib/documents'
import { getTestsByTopicId, Test } from '@/lib/tests'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'

export default function TopicPage() {
  const params = useParams()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [topicDescription, setTopicDescription] = useState<string>(''); // State for topic description
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchTopicData = async () => {
      if (params?.id) {
        try {
          const topicData = await getTopicById(params.id as string)
          if (topicData) {
            setTopic(topicData)
            setEditedTitle(topicData.title || '')
            setEditedDescription(topicData.description || '')
            setTopicDescription(topicData.description || '');
          }
          const docsData = await getDocumentsByTopicId(params.id as string)
          setDocuments(docsData)
          const testsData = await getTestsByTopicId(params.id as string)
          setTests(testsData)
        } catch (error) {
          console.error('Error fetching topic data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTopicData()
  }, [params])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Implement file upload logic here
  }

  const handleUpdateTopicTitle = async () => {
    if (topic && editedTitle !== topic.title) {
      await updateTopic(topic.id, { title: editedTitle });
      setTopic({ ...topic, title: editedTitle });
      setIsEditingTitle(false);
    }
  }

  const handleUpdateTopicDescription = async () => {
    if (topic && editedDescription !== topic.description) {
      await updateTopic(topic.id, { description: editedDescription });
      setTopic({ ...topic, description: editedDescription });
      setIsEditingDescription(false);
    }
  }

  const handleStartNewTest = async () => {
    if (!topic) return;

    try {
      const response = await fetch('/api/generate-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: topic.id,
          topicTitle: topic.title,
          topicDescription: topic.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate test');
      }

      const { testId } = await response.json();
      router.push(`/topics/${topic.id}/tests/${testId}`);
    } catch (error) {
      console.error('Error starting new test:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Topic Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">The requested topic could not be found.</p>
            <Button className="w-full" onClick={() => router.push('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${topic.color}`}>
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-center text-white mr-4">
            {topic.title}
          </h1>
          <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white bg-opacity-20 hover:bg-opacity-30">
                <Edit className="h-4 w-4 text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Topic Title</DialogTitle>
              </DialogHeader>
              <Input 
                value={editedTitle} 
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter new title"
              />
              <Button onClick={handleUpdateTopicTitle}>Save</Button>
            </DialogContent>
          </Dialog>
        </motion.div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="topic-description" className="text-lg font-medium text-white">Description</Label>
            <Dialog open={isEditingDescription} onOpenChange={setIsEditingDescription}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white bg-opacity-20 hover:bg-opacity-30">
                  <Edit className="h-4 w-4 text-white mr-2" />
                  <span className="text-white">Edit</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Topic Description</DialogTitle>
                </DialogHeader>
                <Textarea 
                  value={editedDescription} 
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Enter new description"
                  rows={5}
                />
                <Button onClick={handleUpdateTopicDescription}>Save</Button>
              </DialogContent>
            </Dialog>
          </div>
          <div className="bg-white bg-opacity-90 p-4 rounded-md text-gray-800">
            {topic.description || "No description available."}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Documents</CardTitle>
                <CardDescription>Upload and manage your learning materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">Upload new document</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="file-upload" type="file" className="flex-grow" onChange={handleFileUpload} />
                      <Button>
                        <Upload className="mr-2 h-4 w-4" /> Upload
                      </Button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {documents.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-blue-500" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{doc.uploadDate}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Tests</CardTitle>
                <CardDescription>Take tests and view your results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={handleStartNewTest}>
                    <Play className="mr-2 h-5 w-5" />
                    Start New Test
                  </Button>
                  {tests.map((test, index) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <div>
                        <div className="font-semibold">{test.name}</div>
                        <div className="text-sm text-gray-500">{test.date}</div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 font-semibold mr-2">{test.score}</span>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}