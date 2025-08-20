import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AuthButton from "@/components/AuthButton"
import GistTab from "@/components/GistTab"
import MarketplaceTab from "@/components/MarketplaceTab"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Buzzin
            </h1>
            <p className="text-white/60">Share thoughts, discover marketplace</p>
          </div>
          <AuthButton />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="gist" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="gist" className="text-lg">Gist</TabsTrigger>
            <TabsTrigger value="marketplace" className="text-lg">Marketplace</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gist">
            <GistTab />
          </TabsContent>
          
          <TabsContent value="marketplace">
            <MarketplaceTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}