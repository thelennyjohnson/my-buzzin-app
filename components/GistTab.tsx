'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

export default function GistTab() {
  const [user, setUser] = useState<any>(null)
  const [gists, setGists] = useState<any[]>([])
  const [newGist, setNewGist] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
    loadGists()
  }, [])

  const loadGists = async () => {
    const { data } = await supabase
      .from('gists')
      .select(`
        *,
        profiles(username)
      `)
      .order('created_at', { ascending: false })
    
    setGists(data || [])
  }

  const handlePost = async () => {
    if (!newGist.trim() || !user) return
    setLoading(true)
    
    const { error } = await supabase
      .from('gists')
      .insert([{ user_id: user.id, content: newGist }])

    if (!error) {
      setNewGist('')
      loadGists()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {user && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <Textarea
            placeholder="What's on your mind?"
            value={newGist}
            onChange={(e) => setNewGist(e.target.value)}
            className="mb-4"
          />
          <Button 
            onClick={handlePost} 
            disabled={loading || !newGist.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Posting...' : 'Post Gist'}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {gists.map((gist) => (
          <div key={gist.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <a 
                href={`/profile/${gist.profiles?.username}`}
                className="text-blue-300 font-semibold hover:underline"
              >
                @{gist.profiles?.username || 'Anonymous'}
              </a>
              <span className="text-white/60 text-sm">
                {new Date(gist.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-white">{gist.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}