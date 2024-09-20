"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Play, CheckCircle } from 'lucide-react'

const mockTopics = [
  { id: '1', title: 'Mathematics', color: 'from-purple-500 to-indigo-600' },
  { id: '2', title: 'History', color: 'from-blue-500 to-cyan-600' },
  { id: '3', title: 'Science', color: 'from-green-500 to-emerald-600' },
]

export function Page() {
  const params = useParams()
  const [topicId, setTopicId] = useState<string | null>(null)
  const [topicTitle, setTopicTitle] = useState<string>('')
  const [topicColor, setTopicColor] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Chapter 1.pdf', uploadDate: '2023-05-15' },
    { id: 2, name: 'Chapter 2.pdf', uploadDate: '2023-05-16' },
  ])
  const [tests, setTests] = useState([
    { id: 1, name: 'Test 1', date: '2023-05-20', score: '80%' },
    { id: 2, name: 'Test 2', date: '2023-05-25', score: '90%' },
  ])

  useEffect(() => {
    const initializeTopic = () => {
      let id = params?.id as string
      let title = ''
      let color = ''

      if (!id || !mockTopics.some(topic => topic.id === id)) {
        const defaultTopic = mockTopics[0]
        id = defaultTopic.id
        title = defaultTopic.title
        color = defaultTopic.color
      } else {
        const topic = mockTopics.find(topic => topic.id === id)
        title = topic?.title || ''
        color = topic?.color || ''
      }

      setTopicId(id)
      setTopicTitle(title)
      setTopicColor(color)
      setIsLoading(false)
    }

    initializeTopic()
  }, [params])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setDocuments([...documents, { id: documents.length + 1, name: file.name, uploadDate: new Date().toISOString().split('T')[0] }])
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${topicColor}`}>
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          className="text-5xl font-bold mb-8 text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {topicTitle}
        </motion.h1>
        
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
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
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