"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/') // Redirect to homepage after successful login
    } catch (error) {
      setError('Failed to log in. Please check your credentials.')
      console.error('Login error:', error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
      router.push('/') // Redirect to homepage after successful Google login
    } catch (error) {
      setError('Failed to log in with Google.')
      console.error('Google login error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white bg-opacity-90 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-purple-800">Log in to your account</CardTitle>
            <CardDescription className="text-center text-purple-600">
              Welcome back! Please enter your details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-purple-800">Email</Label>
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
                <Label htmlFor="password" className="text-purple-800">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Log in
              </Button>
            </form>
            <div className="mt-4">
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full border-purple-300 text-purple-800 hover:bg-purple-50"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Log in with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-purple-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-purple-800 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}