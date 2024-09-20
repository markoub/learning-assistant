"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, X, ArrowRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const mockResults = [
  {
    id: 1,
    question: "What is the capital of France?",
    userAnswer: "Paris",
    correctAnswer: "Paris",
    isCorrect: true,
    explanation: "Paris is the capital and most populous city of France."
  },
  {
    id: 2,
    question: "Which of the following are primary colors?",
    userAnswer: ["Red", "Blue", "Green"],
    correctAnswer: ["Red", "Blue", "Yellow"],
    isCorrect: false,
    explanation: "The primary colors are Red, Blue, and Yellow. Green is a secondary color."
  }
]

export function Page() {
  const params = useParams()
  const [results, setResults] = useState(mockResults)
  const [score, setScore] = useState(0)

  useEffect(() => {
    // In a real application, you would fetch the results data here
    // based on the params.id and params.testId
    const correctAnswers = results.filter(result => result.isCorrect).length
    setScore((correctAnswers / results.length) * 100)
  }, [results])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-3xl mx-auto bg-white bg-opacity-90 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-indigo-800">
                Test Results
              </CardTitle>
              <CardDescription className="text-center text-indigo-600">
                Topic: {params.id} - Test: {params.testId}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-indigo-900">Your Score</h3>
                <div className="flex items-center">
                  <Progress value={score} className="flex-grow mr-4" />
                  <span className="text-2xl font-bold text-indigo-700">{score.toFixed(0)}%</span>
                </div>
              </div>
              <div className="space-y-6">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center">
                          {result.isCorrect ? (
                            <Check className="mr-2 h-5 w-5 text-green-500" />
                          ) : (
                            <X className="mr-2 h-5 w-5 text-red-500" />
                          )}
                          Question {result.id}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2 text-indigo-800">{result.question}</p>
                        <p className="mb-1">
                          <span className="font-semibold">Your answer:</span>{' '}
                          {Array.isArray(result.userAnswer) ? result.userAnswer.join(', ') : result.userAnswer}
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold">Correct answer:</span>{' '}
                          {Array.isArray(result.correctAnswer) ? result.correctAnswer.join(', ') : result.correctAnswer}
                        </p>
                        <p className="text-sm text-gray-600">{result.explanation}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link href={`/topics/${params.id}`}>
                  <ArrowRight className="mr-2 h-4 w-4" /> Back to Topic
                </Link>
              </Button>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link href={`/topics/${params.id}/tests/${params.testId}`}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Retake Test
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}