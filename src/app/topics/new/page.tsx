'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { addTopic } from '@/lib/topics'

export default function NewTopic() {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // For now, we'll use a placeholder userId. In a real app, you'd get this from your authentication system.
      const userId = 'placeholder-user-id';
      await addTopic({
        title,
        documentsCount: 0,
        testsCount: 0,
        color: 'bg-purple-500',
        userId
      })
      router.push('/')
    } catch (error) {
      console.error('Error adding topic:', error)
      alert('Failed to add topic. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Add New Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Topic Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Topic'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}