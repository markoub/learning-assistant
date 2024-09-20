"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the registration logic
    console.log('Registration attempted with:', name, email, password)
  }

  const handleGoogleRegister = () => {
    // Here you would typically handle Google registration
    console.log('Google registration attempted')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white bg-opacity-90 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-indigo-800">Create an account</CardTitle>
            <CardDescription className="text-center text-indigo-600">
              Join us and start your learning journey today!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-indigo-800">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-indigo-800">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-indigo-800">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Sign up
              </Button>
            </form>
            <div className="mt-4">
              <Button
                onClick={handleGoogleRegister}
                variant="outline"
                className="w-full border-indigo-300 text-indigo-800 hover:bg-indigo-50"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign up with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-indigo-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-indigo-800 hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}