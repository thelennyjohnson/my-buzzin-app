import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) {
    notFound()
  }

  const { data: gists } = await supabase
    .from('gists')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  const { data: items } = await supabase
    .from('marketplace')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">@{params.username}</h1>
          <div className="flex justify-center gap-4 text-white/60">
            <span>{gists?.length || 0} gists</span>
            <span>•</span>
            <span>{items?.length || 0} items</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Marketplace Items */}
          {items && items.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Selling</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-green-400 font-bold text-lg mb-2">{item.price}</p>
                    {item.category && <p className="text-white/60 text-sm mb-4">{item.category}</p>}
                    
                    {profile.whatsapp && (
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                        <a 
                          href={`https://wa.me/${profile.whatsapp}?text=Hi! I'm interested in your ${item.title} from Buzzin`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Chat on WhatsApp
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Gists */}
          {gists && gists.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Recent Gists</h2>
              <div className="space-y-4">
                {gists.slice(0, 5).map((gist) => (
                  <div key={gist.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                    <p className="text-white mb-2">{gist.content}</p>
                    <p className="text-white/60 text-sm">
                      {new Date(gist.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!gists || gists.length === 0) && (!items || items.length === 0) && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">Nothing shared yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}