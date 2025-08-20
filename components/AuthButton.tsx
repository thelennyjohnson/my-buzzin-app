'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/button'

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return <div className="w-20 h-10 bg-white/20 animate-pulse rounded-lg"></div>

  return user ? (
    <Button onClick={handleSignOut} variant="outline" className="text-white border-white/20">
      Sign Out
    </Button>
  ) : (
    <Button asChild className="bg-blue-600 hover:bg-blue-700">
      <a href="/login">Sign In</a>
    </Button>
  )
}