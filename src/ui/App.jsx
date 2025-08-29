import React, { useState } from 'react'
import { CONFIG } from '../config'
import { createCart, addCustomBookToCart } from '../lib/shopify'
import { track } from '../lib/analytics'
import CheckoutFlow from './CheckoutFlow'
import BookPreview from './BookPreview'
import BookDetail from './BookDetail'

const enhancers = [
  'make it silly', 'underwater world', 'add friendly animals',
  'add a castle', 'outer space', 'sports theme'
]

// Expanded suggestions for each enhancer
const expandedSuggestions = {
  'make it silly': ['add funny hats', 'with googly eyes', 'wearing silly costumes', 'doing silly dances', 'with rainbow colors'],
  'underwater world': ['with coral reefs', 'and sea creatures', 'in a submarine', 'with bubbles everywhere', 'and treasure chests'],
  'add friendly animals': ['playing together', 'having a picnic', 'going on adventures', 'helping each other', 'celebrating birthdays'],
  'add a castle': ['with knights', 'and princesses', 'with dragons', 'and magic spells', 'with a moat'],
  'outer space': ['with planets', 'and aliens', 'in a spaceship', 'with stars everywhere', 'and rocket ships'],
  'sports theme': ['playing soccer', 'basketball game', 'swimming race', 'baseball match', 'tennis tournament']
}

// Generated dragon book with real images
const dragonBook = {
  id: 0,
  title: "Dragon & Treehouse Adventure",
  category: "fantasy",
  prompt: "a friendly dragon helping kids build a treehouse",
  images: [
    "https://colorbook-backend-worldfrees.3dworldjames.workers.dev/images/coloring-pages/1756503621605-dssz16cx5.png",
    "https://colorbook-backend-worldfrees.3dworldjames.workers.dev/images/coloring-pages/1756503627447-n7w5pnukr.png",
    "https://colorbook-backend-worldfrees.3dworldjames.workers.dev/images/coloring-pages/1756503633825-qvt9kn7p2.png",
    "https://colorbook-backend-worldfrees.3dworldjames.workers.dev/images/coloring-pages/1756503639457-4zb0xwouu.png"
  ]
}

// Popular coloring book categories with sample images (child-friendly)
const popularBooks = [
  { id: 1, title: "Dinosaur Adventure", category: "dinosaurs", image: "🦖", color: "bg-green-100" },
  { id: 2, title: "Space Explorer", category: "space", image: "🚀", color: "bg-blue-100" },
  { id: 3, title: "Ocean Friends", category: "animals", image: "🐠", color: "bg-cyan-100" },
  { id: 4, title: "Fairy Tale Castle", category: "fantasy", image: "🏰", color: "bg-purple-100" },
  { id: 5, title: "Jungle Safari", category: "animals", image: "🦁", color: "bg-yellow-100" },
  { id: 6, title: "Robot World", category: "technology", image: "🤖", color: "bg-gray-100" },
  { id: 7, title: "Princess Dreams", category: "fantasy", image: "👑", color: "bg-pink-100" },
  { id: 8, title: "Sports Stars", category: "sports", image: "⚽", color: "bg-orange-100" },
  { id: 9, title: "Farm Animals", category: "animals", image: "🐄", color: "bg-green-100" },
  { id: 10, title: "Superheroes", category: "action", image: "🦸", color: "bg-red-100" },
  { id: 11, title: "Butterfly Garden", category: "nature", image: "🦋", color: "bg-purple-100" },
  { id: 12, title: "Construction Site", category: "vehicles", image: "🚧", color: "bg-yellow-100" },
  { id: 13, title: "Underwater World", category: "ocean", image: "🐙", color: "bg-blue-100" },
  { id: 14, title: "Magical Forest", category: "fantasy", image: "🌲", color: "bg-green-100" },
  { id: 15, title: "Race Cars", category: "vehicles", image: "🏎️", color: "bg-red-100" },
  { id: 16, title: "Zoo Animals", category: "animals", image: "🦒", color: "bg-orange-100" },
  { id: 17, title: "Pirate Adventure", category: "adventure", image: "🏴‍☠️", color: "bg-yellow-100" },
  { id: 18, title: "Unicorn Dreams", category: "fantasy", image: "🦄", color: "bg-pink-100" },
  { id: 19, title: "Firefighter Hero", category: "community", image: "🚒", color: "bg-red-100" },
  { id: 20, title: "Garden Party", category: "nature", image: "🌸", color: "bg-pink-100" },
  { id: 21, title: "Dragon Tales", category: "fantasy", image: "🐉", color: "bg-orange-100" },
  { id: 22, title: "Beach Day", category: "summer", image: "🏖️", color: "bg-blue-100" },
  { id: 23, title: "Circus Fun", category: "entertainment", image: "🎪", color: "bg-purple-100" },
  { id: 24, title: "Weather Wonders", category: "nature", image: "🌈", color: "bg-cyan-100" },
  { id: 25, title: "School Days", category: "education", image: "📚", color: "bg-blue-100" },
  { id: 26, title: "Birthday Party", category: "celebration", image: "🎂", color: "bg-pink-100" },
  { id: 27, title: "Camping Trip", category: "outdoors", image: "⛺", color: "bg-green-100" },
  { id: 28, title: "Doctor Visit", category: "community", image: "👨‍⚕️", color: "bg-blue-100" },
  { id: 29, title: "Pet Friends", category: "animals", image: "🐕", color: "bg-yellow-100" },
  { id: 30, title: "Holiday Magic", category: "seasonal", image: "🎄", color: "bg-green-100" },
  { id: 31, title: "Art Studio", category: "creative", image: "🎨", color: "bg-purple-100" },
  { id: 32, title: "Music Band", category: "music", image: "🎸", color: "bg-pink-100" },
  { id: 33, title: "Baking Time", category: "food", image: "🍪", color: "bg-orange-100" },
  { id: 34, title: "Toy Store", category: "toys", image: "🧸", color: "bg-yellow-100" },
  { id: 35, title: "Library Visit", category: "education", image: "📖", color: "bg-blue-100" },
  { id: 36, title: "Park Playground", category: "outdoors", image: "🎠", color: "bg-green-100" },
  { id: 37, title: "Train Journey", category: "transportation", image: "🚂", color: "bg-blue-100" },
  { id: 38, title: "Ice Cream Shop", category: "food", image: "🍦", color: "bg-pink-100" },
  { id: 39, title: "Police Officer", category: "community", image: "👮", color: "bg-blue-100" },
  { id: 40, title: "Flower Garden", category: "nature", image: "🌺", color: "bg-pink-100" },
  { id: 41, title: "Monster Friends", category: "fantasy", image: "👹", color: "bg-purple-100" },
  { id: 42, title: "Soccer Game", category: "sports", image: "⚽", color: "bg-green-100" },
  { id: 43, title: "Aquarium Visit", category: "ocean", image: "🐠", color: "bg-cyan-100" },
  { id: 44, title: "Mountain Hike", category: "outdoors", image: "⛰️", color: "bg-green-100" },
  { id: 45, title: "Dance Class", category: "dance", image: "💃", color: "bg-purple-100" },
  { id: 46, title: "Science Lab", category: "education", image: "🧪", color: "bg-blue-100" },
  { id: 47, title: "Pizza Party", category: "food", image: "🍕", color: "bg-orange-100" },
  { id: 48, title: "Sleepover Fun", category: "friends", image: "🛏️", color: "bg-pink-100" }
]

// Adult coloring book categories (18+ content)
const adultBooks = [
  { id: 101, title: "Wine & Dine", category: "adult", image: "🍷", color: "bg-red-100" },
  { id: 102, title: "Cocktail Hour", category: "adult", image: "🍸", color: "bg-orange-100" },
  { id: 103, title: "Spa Day", category: "adult", image: "🧖‍♀️", color: "bg-pink-100" },
  { id: 104, title: "Garden Party", category: "adult", image: "🌺", color: "bg-green-100" },
  { id: 105, title: "Travel Dreams", category: "adult", image: "✈️", color: "bg-blue-100" },
  { id: 106, title: "Coffee Shop", category: "adult", image: "☕", color: "bg-brown-100" },
  { id: 107, title: "Book Club", category: "adult", image: "📚", color: "bg-purple-100" },
  { id: 108, title: "Yoga Flow", category: "adult", image: "🧘‍♀️", color: "bg-cyan-100" },
  { id: 109, title: "Cooking Class", category: "adult", image: "👨‍🍳", color: "bg-orange-100" },
  { id: 110, title: "Art Gallery", category: "adult", image: "🎨", color: "bg-purple-100" },
  { id: 111, title: "Jazz Night", category: "adult", image: "🎷", color: "bg-blue-100" },
  { id: 112, title: "Beach Resort", category: "adult", image: "🏖️", color: "bg-yellow-100" },
  { id: 113, title: "Mountain Retreat", category: "adult", image: "⛰️", color: "bg-green-100" },
  { id: 114, title: "Tea Ceremony", category: "adult", image: "🫖", color: "bg-pink-100" },
  { id: 115, title: "Chess Club", category: "adult", image: "♟️", color: "bg-gray-100" },
  { id: 116, title: "Photography", category: "adult", image: "📷", color: "bg-black-100" },
  { id: 117, title: "Pottery Studio", category: "adult", image: "🏺", color: "bg-brown-100" },
  { id: 118, title: "Wine Tasting", category: "adult", image: "🍇", color: "bg-purple-100" },
  { id: 119, title: "Sailing Adventure", category: "adult", image: "⛵", color: "bg-blue-100" },
  { id: 120, title: "Golf Course", category: "adult", image: "⛳", color: "bg-green-100" },
  { id: 121, title: "Opera House", category: "adult", image: "🎭", color: "bg-red-100" },
  { id: 122, title: "Library Study", category: "adult", image: "📖", color: "bg-brown-100" },
  { id: 123, title: "Bakery Shop", category: "adult", image: "🥖", color: "bg-yellow-100" },
  { id: 124, title: "Antique Store", category: "adult", image: "🕰️", color: "bg-brown-100" },
  { id: 125, title: "Botanical Garden", category: "adult", image: "🌿", color: "bg-green-100" },
  { id: 126, title: "Jazz Club", category: "adult", image: "🎺", color: "bg-purple-100" },
  { id: 127, title: "Art Studio", category: "adult", image: "🎨", color: "bg-pink-100" },
  { id: 128, title: "Wine Cellar", category: "adult", image: "🍷", color: "bg-red-100" },
  { id: 129, title: "Spa Retreat", category: "adult", image: "💆‍♀️", color: "bg-pink-100" },
  { id: 130, title: "Cooking Show", category: "adult", image: "👩‍🍳", color: "bg-orange-100" },
  { id: 131, title: "Garden Design", category: "adult", image: "🌱", color: "bg-green-100" },
  { id: 132, title: "Travel Journal", category: "adult", image: "🗺️", color: "bg-blue-100" },
  { id: 133, title: "Coffee Art", category: "adult", image: "☕", color: "bg-brown-100" },
  { id: 134, title: "Book Reading", category: "adult", image: "📚", color: "bg-purple-100" },
  { id: 135, title: "Meditation", category: "adult", image: "🧘‍♂️", color: "bg-cyan-100" },
  { id: 136, title: "Chef's Kitchen", category: "adult", image: "👨‍🍳", color: "bg-orange-100" },
  { id: 137, title: "Art Exhibition", category: "adult", image: "🖼️", color: "bg-purple-100" },
  { id: 138, title: "Jazz Ensemble", category: "adult", image: "🎷", color: "bg-blue-100" },
  { id: 139, title: "Beach House", category: "adult", image: "🏠", color: "bg-yellow-100" },
  { id: 140, title: "Mountain Lodge", category: "adult", image: "🏔️", color: "bg-green-100" },
  { id: 141, title: "Tea Garden", category: "adult", image: "🫖", color: "bg-pink-100" },
  { id: 142, title: "Chess Tournament", category: "adult", image: "♟️", color: "bg-gray-100" },
  { id: 143, title: "Photo Studio", category: "adult", image: "📸", color: "bg-black-100" },
  { id: 144, title: "Pottery Class", category: "adult", image: "🏺", color: "bg-brown-100" },
  { id: 145, title: "Wine Bar", category: "adult", image: "🍷", color: "bg-purple-100" },
  { id: 146, title: "Sailing Club", category: "adult", image: "⛵", color: "bg-blue-100" },
  { id: 147, title: "Golf Club", category: "adult", image: "⛳", color: "bg-green-100" },
  { id: 148, title: "Opera Night", category: "adult", image: "🎭", color: "bg-red-100" }
]

export default function App() {
  const [prompt, setPrompt] = useState('a car being chased by dinosaurs!')
  const [cycles, setCycles] = useState([])
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState(null)
  const [err, setErr] = useState(null)
  const [activeTab, setActiveTab] = useState('create')
  const [expandedEnhancer, setExpandedEnhancer] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  
  React.useEffect(() => {
    track('page_viewed', { 
      page: 'generator',
      hasExistingCycles: cycles.length > 0
    })
  }, [])

  const canGenerate = !busy && prompt.trim().length > 0 && cycles.length < CONFIG.MAX_CYCLES

  const addToPrompt = (suggestion) => {
    const currentPrompt = prompt.replace(/!$/, '') // Remove exclamation mark
    const newPrompt = currentPrompt + ', ' + suggestion + '!'
    setPrompt(newPrompt)
    setExpandedEnhancer(null) // Close the dropdown
  }

  async function generateCycle(extra='') {
    setBusy(true); setErr(null)
    try {
      const fullPrompt = (prompt + ' ' + extra).trim()
      const response = await fetch(`${CONFIG.BACKEND_URL}/generate-previews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      })
      
      if (!response.ok) throw new Error('Failed to generate previews')
      
      const { sessionId, images } = await response.json()
      const id = crypto.randomUUID()
      const next = [...cycles, { id, images, sessionId }]
      setCycles(next)
      
      track('preview_generated', { 
        idx: cycles.length + 1, 
        prompt: fullPrompt,
        hasEnhancer: extra.length > 0,
        enhancer: extra || null,
        totalCycles: next.length
      })
    } catch (e) { 
      track('preview_error', { error: e.message, prompt: fullPrompt })
      setErr(e.message) 
    }
    finally { setBusy(false) }
  }

  function approveSet(c) { 
    setSelected(c); 
    track('set_approved', { 
      setId: c.id, 
      cycleIndex: cycles.findIndex(cycle => cycle.id === c.id) + 1,
      totalCycles: cycles.length,
      prompt: prompt
    }) 
  }

  async function checkout() {
    if (!selected) return
    
    // Lock the design first
    setBusy(true); setErr(null)
    try {
      const lockResponse = await fetch(`${CONFIG.BACKEND_URL}/lock-design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: selected.sessionId, 
          chosen: selected.images,
          prompt: prompt
        })
      })
      
      if (!lockResponse.ok) throw new Error('Failed to lock design')
      
      const { designId } = await lockResponse.json()
      
      track('checkout_started', { 
        designId, 
        prompt: prompt,
        totalCycles: cycles.length
      })
      
      // Show checkout flow
      setShowCheckout(true)
      
    } catch (e) { 
      setErr(e.message) 
    } finally { 
      setBusy(false) 
    }
  }

  const handleBookSelect = (book) => {
    setSelectedBook(book)
    setActiveTab('create') // Show the create section with the selected book
    
    // Scroll to top to show the selected book
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBookBack = () => {
    setSelectedBook(null)
  }

  const handleBookAddToCart = async () => {
    if (!selectedBook) return
    
    setBusy(true)
    setErr(null)
    
    try {
      // Add the selected book to cart
      const cart = await createCart()
      await addCustomBookToCart(cart.id, selectedBook.id, selectedBook.prompt)
      
      setShowCheckout(true)
    } catch (error) {
      console.error('Add to cart error:', error)
      setErr('Failed to add to cart. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background - Coloring Book Pages Transition */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-pulse"></div>
        
        {/* Coloring book pages transitioning from colored to black/white */}
        <div className="absolute top-10 left-10 w-32 h-40 bg-gradient-to-b from-yellow-200 via-orange-200 to-red-200 rounded-lg shadow-lg opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-32 h-40 bg-gradient-to-b from-green-200 via-blue-200 to-purple-200 rounded-lg shadow-lg opacity-25 animate-bounce"></div>
        <div className="absolute top-40 left-1/4 w-32 h-40 bg-gradient-to-b from-pink-200 via-red-200 to-orange-200 rounded-lg shadow-lg opacity-20 animate-spin"></div>
        
        {/* Black and white versions */}
        <div className="absolute top-60 right-1/3 w-32 h-40 bg-white border-2 border-gray-300 rounded-lg shadow-lg opacity-40 animate-pulse"></div>
        <div className="absolute top-80 left-1/3 w-32 h-40 bg-white border-2 border-gray-300 rounded-lg shadow-lg opacity-35 animate-bounce"></div>
        <div className="absolute top-32 right-1/4 w-32 h-40 bg-white border-2 border-gray-300 rounded-lg shadow-lg opacity-30 animate-spin"></div>
        
        {/* More scattered coloring book pages */}
        <div className="absolute bottom-20 left-10 w-32 h-40 bg-gradient-to-b from-cyan-200 via-blue-200 to-indigo-200 rounded-lg shadow-lg opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-32 h-40 bg-white border-2 border-gray-300 rounded-lg shadow-lg opacity-30 animate-bounce"></div>
        <div className="absolute bottom-60 left-1/3 w-32 h-40 bg-gradient-to-b from-yellow-200 via-green-200 to-blue-200 rounded-lg shadow-lg opacity-20 animate-spin"></div>
        <div className="absolute bottom-80 right-1/3 w-32 h-40 bg-white border-2 border-gray-300 rounded-lg shadow-lg opacity-35 animate-pulse"></div>
        
        {/* Additional scattered elements */}
        <div className="absolute top-1/4 left-1/2 w-32 h-40 bg-gradient-to-b from-purple-200 via-pink-200 to-red-200 rounded-lg shadow-lg opacity-25 animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-40 bg-white border-2 border-gray-300 rounded-lg shadow-lg opacity-30 animate-pulse"></div>
        <div className="absolute top-2/3 left-1/4 w-32 h-40 bg-gradient-to-b from-orange-200 via-yellow-200 to-green-200 rounded-lg shadow-lg opacity-20 animate-spin"></div>
        <div className="absolute top-3/4 right-1/2 w-32 h-40 bg-white border-2 border-gray-300 rounded-lg shadow-lg opacity-25 animate-bounce"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🎨</div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ColorMeFree
                </h1>
              </div>
              <nav className="flex items-center space-x-6">
                <button 
                  onClick={() => setActiveTab('create')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'create' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Create Your Own
                </button>
                <button 
                  onClick={() => setActiveTab('browse')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'browse' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Browse Popular Books
                </button>

              </nav>
            </div>
        </div>
      </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'create' ? (
            <>
              {/* Hero Section */}
              <section className="text-center mb-12">
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-12 text-white shadow-2xl">
                  <h2 className="text-5xl font-bold mb-4">Create Your Child's Perfect Coloring Book</h2>
                  <p className="text-xl mb-8 opacity-90">Type any idea and see it come to life instantly. We'll create a complete 30-page book just for them!</p>
                  
                  <div className="max-w-2xl mx-auto">
                    <div className="flex gap-3 mb-4">
                      <input 
                        value={prompt} 
                        onChange={e=>setPrompt(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && canGenerate) {
                    track('generate_enter_pressed', { prompt: e.target.value })
                    generateCycle('')
                  }
                }}
                        placeholder="a car being chased by dinosaurs!"
                        className="flex-1 px-6 py-4 rounded-2xl text-gray-800 text-lg border-0 focus:ring-4 focus:ring-white/30 outline-none"
                      />
                      <button 
                        disabled={!canGenerate}
                onClick={()=>{
                  track('generate_button_clicked', { 
                    prompt: prompt,
                    promptLength: prompt.length,
                    totalCycles: cycles.length
                  })
                  generateCycle('')
                }}
                        className="px-8 py-4 rounded-2xl bg-white text-purple-600 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all shadow-lg"
                      >
                        {busy ? 'Creating...' : 'Create Now!'}
                      </button>
            </div>
                    
                    <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
                      <span className="opacity-80">Try:</span>
            {enhancers.map(eh=>(
                        <div key={eh} className="relative">
                          <button 
                            onClick={()=>{
                              if (expandedEnhancer === eh) {
                                setExpandedEnhancer(null)
                              } else {
                                setExpandedEnhancer(eh)
                track('enhancer_clicked', { enhancer: eh, prompt: prompt })
                              }
              }}
                disabled={!canGenerate}
                            className="px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 disabled:opacity-30 transition-all"
                          >
                            {eh}
                          </button>
                          
                          {/* Dropdown with expanded suggestions */}
                          {expandedEnhancer === eh && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl p-3 z-50 min-w-48">
                              <div className="text-gray-800 text-sm font-medium mb-2">Choose an option:</div>
                              {expandedSuggestions[eh].map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => addToPrompt(suggestion)}
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
          </div>
                          )}
                </div>
              ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Selected Book Display */}
              {selectedBook && (
                <section className="mb-12">
                  <BookDetail 
                    book={selectedBook}
                    onAddToCart={handleBookAddToCart}
                    onBack={handleBookBack}
                  />
                </section>
              )}

              {/* Preview Section */}
              {cycles.length > 0 && (
                <section className="mb-12">
                  <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Preview Pages</h3>
                    <div className="grid grid-cols-5 gap-4 mb-6">
                      {cycles[cycles.length-1].images.map((u,i)=>(
                        <div key={i} className="relative border-2 border-purple-200 rounded-xl overflow-hidden shadow-lg">
                          <img src={u} alt="" className="w-full h-48 object-cover" />
                        </div>
                      ))}
                      <div className="relative border-2 border-purple-200 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                        <div className="text-center p-4">
                          <div className="text-2xl font-bold text-purple-600">25+ MORE pages</div>
                          <div className="text-sm text-purple-500">in the same style</div>
                </div>
              </div>
            </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={()=>approveSet(cycles[cycles.length-1])}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:shadow-lg transition-all"
                      >
                        ✅ Approve These 4 Pages
                      </button>
                      <button 
                        disabled={!(prompt && cycles.length<CONFIG.MAX_CYCLES)} 
                        onClick={()=>{
                track('refresh_clicked', { 
                  cycleIndex: cycles.length,
                  prompt: prompt,
                  totalCycles: cycles.length
                })
                generateCycle('')
              }}
                        className="px-8 py-3 rounded-xl border-2 border-purple-300 text-purple-600 font-bold hover:bg-purple-50 transition-all"
                      >
                        ↻ Try Different Pages
                      </button>
                    </div>
            </div>
          </section>
        )}

              {/* Previous Sets */}
              {cycles.length > 1 && (
                <section className="mb-12">
                  <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Previous Sets</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4">
              {cycles.map((c, index)=>(
                        <button 
                          key={c.id} 
                          onClick={()=>{
                  track('cycle_selected', { 
                    cycleIndex: index + 1, 
                    setId: c.id,
                    wasSelected: selected?.id === c.id
                  })
                  setSelected(c)
                }}
                          className={`border-2 rounded-xl p-2 transition-all ${
                            selected?.id===c.id 
                              ? 'border-purple-500 ring-4 ring-purple-200' 
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <img src={c.images[0]} className="h-24 w-18 object-cover rounded-lg" />
                </button>
              ))}
                    </div>
            </div>
          </section>
        )}

        {/* Checkout */}
        {selected && (
                <section className="mb-12">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 shadow-xl border-2 border-green-200">
                    <div className="text-center mb-6">
                      <div className="text-2xl font-bold text-green-800 mb-2">Selected Set Locked! 🎉</div>
                      <div className="text-green-600">These exact 4 pages will be included. We'll generate a full book in the same style.</div>
            </div>
                    <div className="text-center">
                      <button 
                        onClick={()=>{
              track('checkout_button_clicked', { 
                designId: selected.id,
                prompt: prompt,
                totalCycles: cycles.length
              })
              checkout()
                        }} 
                        disabled={busy}
                        className="px-12 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl hover:shadow-xl transition-all disabled:opacity-50"
                      >
                        {busy ? 'Processing...' : 'Add to Cart & Checkout'}
                      </button>
                      <div className="text-sm text-green-600 mt-3">Secure checkout</div>
                    </div>
                  </div>
          </section>
        )}

              {/* Popular Books Below Creation Area - 3x16 Grid */}
              <section className="mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Popular Coloring Books</h3>
                  <p className="text-lg text-gray-600">Choose from our most loved themes or create your own custom book above!</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {/* Dragon Book - First Position */}
                  <BookPreview book={dragonBook} onClick={() => handleBookSelect(dragonBook)} />
                  
                  {/* Existing Books */}
                  {popularBooks.slice(0, 47).map((book) => (
                    <div key={book.id} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 cursor-pointer" onClick={() => handleBookSelect(book)}>
                      <div className={`${book.color} rounded-lg p-6 text-center mb-3`}>
                        <div className="text-4xl mb-2">{book.image}</div>
                      </div>
                      <h4 className="text-sm font-bold text-gray-800 text-center">{book.title}</h4>
                    </div>
                  ))}
                </div>
              </section>

              {err && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-red-700 text-center">
                  <div className="font-bold mb-2">Oops! Something went wrong</div>
                  <div>{err}</div>
                </div>
              )}
            </>
          ) : (
            /* Browse Popular Books Section - 3x16 Grid */
            <section>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Coloring Books</h2>
                <p className="text-xl text-gray-600">Choose from our most loved themes or create your own custom book above!</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Dragon Book - First Position */}
                <BookPreview book={dragonBook} onClick={() => handleBookSelect(dragonBook)} />
                
                {/* Existing Books */}
                {popularBooks.slice(0, 47).map((book) => (
                  <div key={book.id} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 cursor-pointer" onClick={() => handleBookSelect(book)}>
                    <div className={`${book.color} rounded-lg p-6 text-center mb-3`}>
                      <div className="text-4xl mb-2">{book.image}</div>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 text-center">{book.title}</h4>
                  </div>
                ))}
              </div>
        </section>
          )}
      </main>

        {/* Checkout Flow */}
        {showCheckout && (
          <CheckoutFlow
            selected={selected}
            prompt={prompt}
            onClose={() => setShowCheckout(false)}
            onComplete={() => {
              setShowCheckout(false)
              setSelected(null)
              setCycles([])
              setPrompt('a car being chased by dinosaurs!')
            }}
          />
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="text-2xl">🎨</div>
                  <h3 className="text-xl font-bold">ColorMeFree</h3>
                </div>
                <p className="text-gray-400">Create personalized coloring books that spark your child's imagination.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Create Custom Book</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Popular Books</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="privacy.html" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>COPPA Compliant</li>
                  <li>Designed for adults (18+)</li>
                  <li>Safe for children</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} ColorMeFree • Designed for adults (18+) to create books for children</p>
            </div>
          </div>
        </footer>
        </div>
    </div>
  )
}
