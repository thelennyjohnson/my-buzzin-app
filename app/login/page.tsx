'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'profile'>('email')
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Check if user has profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (!profile) {
          setStep('profile')
        } else {
          router.push('/')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleMagicLink = async () => {
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: { 
        emailRedirectTo: `${window.location.origin}/login` 
      }
    })
    
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('✅ Check your email for the magic link!')
    }
    setLoading(false)
  }

  const handleCreateProfile = async () => {
    if (!username) return
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .insert([{ id: user.id, username, whatsapp }])

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md">
        {step === 'email' ? (
          <>
            <h1 className="text-3xl font-bold text-white mb-6 text-center">Join Buzzin</h1>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Button 
              onClick={handleMagicLink} 
              disabled={loading || !email}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white mb-6 text-center">Setup Profile</h1>
            <Input
              placeholder="Choose username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4"
            />
            <Input
              placeholder="WhatsApp number (optional)"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="mb-4"
            />
            <Button 
              onClick={handleCreateProfile} 
              disabled={loading || !username}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Creating...' : 'Complete Profile'}
            </Button>
          </>
        )}
        
        {message && (
          <p className="mt-4 text-center text-white/80">{message}</p>
        )}
      </div>
    </div>
  )
}