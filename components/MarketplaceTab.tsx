'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function MarketplaceTab() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', price: '', category: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
    loadItems()
  }, [])

  const loadItems = async () => {
    const { data } = await supabase
      .from('marketplace')
      .select(`
        *,
        profiles(username, whatsapp)
      `)
      .order('created_at', { ascending: false })
    
    setItems(data || [])
  }

  const handlePost = async () => {
    if (!newItem.title || !newItem.price || !user) return
    setLoading(true)
    
    const { error } = await supabase
      .from('marketplace')
      .insert([{ 
        user_id: user.id, 
        title: newItem.title,
        price: newItem.price,
        category: newItem.category
      }])

    if (!error) {
      setNewItem({ title: '', price: '', category: '' })
      setShowForm(false)
      loadItems()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {user && (
        <div className="text-center">
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700"
          >
            {showForm ? 'Cancel' : 'List Item'}
          </Button>
        </div>
      )}

      {showForm && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <div className="space-y-4">
            <Input
              placeholder="Item title"
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
            />
            <Input
              placeholder="Price (e.g., ₦5,000)"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
            />
            <Input
              placeholder="Category (optional)"
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            />
            <Button 
              onClick={handlePost} 
              disabled={loading || !newItem.title || !newItem.price}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Posting...' : 'List Item'}
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-green-400 font-bold">{item.price}</p>
                {item.category && <p className="text-white/60 text-sm">{item.category}</p>}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <a 
                href={`/profile/${item.profiles?.username}`}
                className="text-blue-300 text-sm hover:underline"
              >
                @{item.profiles?.username}
              </a>
              {item.profiles?.whatsapp && (
                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                  <a 
                    href={`https://wa.me/${item.profiles.whatsapp}?text=Hi! I saw your ${item.title} on Buzzin`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat Seller
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}