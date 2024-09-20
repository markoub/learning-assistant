'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, BookOpen, Zap, Brain, Target, Trophy, LogOut } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const topics = [
  { id: 1, title: 'Mathematics', documentsCount: 3, testsCount: 2, color: 'bg-purple-500' },
  { id: 2, title: 'History', documentsCount: 5, testsCount: 1, color: 'bg-blue-500' },
  { id: 3, title: 'Science', documentsCount: 4, testsCount: 3, color: 'bg-green-500' },
  { id: 4, title: 'Literature', documentsCount: 2, testsCount: 2, color: 'bg-yellow-500' },
]

const features = [
  { title: 'Personalized Learning', description: 'Tailored content for your unique learning style', icon: Brain },
  { title: 'Interactive Tests', description: 'Engage with dynamic quizzes to reinforce your knowledge', icon: Zap },
  { title: 'Progress Tracking', description: 'Monitor your improvement with detailed analytics', icon: Target },
  { title: 'Achievement System', description: 'Earn badges and rewards as you learn', icon: Trophy },
]

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Learning Journey
          </motion.h1>
          <motion.div
            className="space-x-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {user ? (
              <>
                <span className="text-white mr-4">Welcome, {user.displayName || user.email}</span>
                <Button onClick={handleSignOut} variant="outline" className="bg-white text-purple-700 hover:bg-purple-100">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="bg-white text-purple-700 hover:bg-purple-100">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-purple-700 text-white hover:bg-purple-800">
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </motion.div>
        </header>

        <motion.p
          className="text-xl mb-12 text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Embark on a personalized educational adventure. Explore topics, take tests, and track your progress.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className={`${topic.color} text-white`}>
                  <CardTitle>{topic.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600">{topic.documentsCount} documents • {topic.testsCount} tests</p>
                </CardContent>
                <CardFooter className="bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300">
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href={`/topics/${topic.id}`}>
                      <BookOpen className="mr-2 h-4 w-4" /> Explore
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-purple-700">Why Choose Our Platform?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <feature.icon className="h-6 w-6 text-purple-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-purple-700">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-100" asChild>
            <Link href="/topics/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Topic
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
