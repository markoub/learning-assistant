'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  type: 'single' | 'multiple';
  correctAnswer: string | string[];
  explanation: string;
}

export default function TestPage() {
  const router = useRouter()
  const params = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTest = async () => {
      if (params.testId) {
        try {
          const response = await fetch(`/api/tests/${params.testId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch test data');
          }
          const testData = await response.json();
          // Ensure options are parsed correctly
          const parsedQuestions = testData.questions.map((q: any) => ({
            ...q,
            options: Array.isArray(q.options) ? q.options : JSON.parse(q.options)
          }));
          setQuestions(parsedQuestions);
        } catch (error) {
          console.error('Error fetching test:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTest();
  }, [params.testId]);

  const handleAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsSubmitting(true)
      // Simulate API call to submit test
      setTimeout(() => {
        setIsSubmitting(false)
        setShowResults(true)
      }, 1500)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (showResults) {
    router.push(`/topics/${params.id}/tests/${params.testId}/results`)
    return null
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-2xl font-semibold">Loading test...</p>
    </div>;
  }

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-2xl font-semibold">No questions found for this test. Please check the console for more information.</p>
    </div>;
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-3xl mx-auto bg-white bg-opacity-90 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-purple-800">
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              <CardDescription className="text-center text-purple-600">
                Topic: {params.id} - Test: {params.testId}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {question && (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-purple-900">{question.text}</h3>
                  {question.type === 'single' ? (
                    <RadioGroup
                      onValueChange={(value) => handleAnswer(question.id, value)}
                      value={answers[question.id] as string}
                      className="space-y-2"
                    >
                      {Array.isArray(question.options) && question.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-purple-100 transition-colors">
                          <RadioGroupItem value={option.id} id={`q${question.id}-${option.id}`} />
                          <Label htmlFor={`q${question.id}-${option.id}`} className="text-purple-800">{option.text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      {Array.isArray(question.options) && question.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-purple-100 transition-colors">
                          <Checkbox
                            id={`q${question.id}-${option.id}`}
                            checked={(answers[question.id] as string[] || []).includes(option.id)}
                            onCheckedChange={(checked) => {
                              const currentAnswers = answers[question.id] as string[] || []
                              if (checked) {
                                handleAnswer(question.id, [...currentAnswers, option.id])
                              } else {
                                handleAnswer(question.id, currentAnswers.filter(a => a !== option.id))
                              }
                            }}
                          />
                          <Label htmlFor={`q${question.id}-${option.id}`} className="text-purple-800">{option.text}</Label>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex items-center"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <div className="flex-grow mx-4">
                <Progress value={progress} className="w-full" />
              </div>
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : currentQuestion === questions.length - 1 ? (
                  <>Finish Test <Check className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}