import React, { useState } from 'react'
import { CONFIG } from '../config'
import { createCart, addCustomBookToCart } from '../lib/shopify'
import { track } from '../lib/analytics'

const enhancers = [
  'make it silly', 'underwater world', 'add friendly animals',
  'add a castle', 'outer space', 'sports theme'
]

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [cycles, setCycles] = useState([]) // each: {id, images:[url,url,url,url]}
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState(null) // {id, images}
  const [err, setErr] = useState(null)
  
  // Track page load
  React.useEffect(() => {
    track('page_viewed', { 
      page: 'generator',
      hasExistingCycles: cycles.length > 0
    })
  }, [])

  const canGenerate = !busy && prompt.trim().length > 0 && cycles.length < CONFIG.MAX_CYCLES

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
      
      // Enhanced tracking
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
    setBusy(true); setErr(null)
    try {
      // Lock the design in backend first
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
      
      const cart = await createCart()
      const primary = await addCustomBookToCart(cart.id, {
        designId, prompt, variantGID: CONFIG.CUSTOM_BOOK_VARIANT_GID
      })
      // Simple upsell UI: show confirm() for second copy (you can make this a modal)
      const addSecond = window.confirm('Add a second custom book for 20% off? We\'ll apply code COLOR20 at checkout.')
      
      // Track upsell decision
      track('upsell_shown', { designId })
      let finalCart = primary
      if (addSecond) {
        track('upsell_accepted', { designId, discountCode: 'COLOR20' })
        finalCart = await addCustomBookToCart(primary.id, {
          designId: designId + '-copy',
          prompt: prompt + ' (second book)',
          variantGID: CONFIG.CUSTOM_BOOK_VARIANT_GID
        })
      } else {
        track('upsell_declined', { designId })
      }
      
      const checkoutUrl = new URL(finalCart.checkoutUrl)
      checkoutUrl.searchParams.set('discount', 'COLOR20')
      track('checkout_start', { 
        addSecond, 
        designId, 
        totalItems: addSecond ? 2 : 1,
        discountCode: 'COLOR20'
      })
      window.location.href = checkoutUrl.toString()
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create a Custom Coloring Book for Your Child</h1>
          <a href="#created" className="text-sm underline">Top books</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Type any idea. See 4 preview pages instantly.</h2>
          <p className="text-gray-600">We create black-and-white outlines with simple backgrounds that fill two-thirds of the page—perfect for children's coloring.</p>
                      <div className="flex gap-2">
              <input value={prompt} onChange={e=>setPrompt(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && canGenerate) {
                    track('generate_enter_pressed', { prompt: e.target.value })
                    generateCycle('')
                  }
                }}
                placeholder="e.g., a car driving down the highway being chased by dinosaurs"
                className="flex-1 border rounded-xl px-4 py-3" />
              <button disabled={!canGenerate}
                onClick={()=>{
                  track('generate_button_clicked', { 
                    prompt: prompt,
                    promptLength: prompt.length,
                    totalCycles: cycles.length
                  })
                  generateCycle('')
                }}
                className="px-5 py-3 rounded-xl bg-black text-white disabled:opacity-50">Generate</button>
            </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Idea enhancers:</span>
            {enhancers.map(eh=>(
              <button key={eh} onClick={()=>{
                track('enhancer_clicked', { enhancer: eh, prompt: prompt })
                generateCycle(eh)
              }}
                disabled={!canGenerate}
                className="px-2 py-1 border rounded-full hover:bg-gray-50 disabled:opacity-30">{eh}</button>
            ))}
            <span className="ml-auto">{cycles.length}/{CONFIG.MAX_CYCLES} cycles</span>
          </div>
          {err && <div className="text-red-600 text-sm">{err}</div>}
        </section>

        {/* Preview grid */}
        {cycles.length>0 && (
          <section className="space-y-3">
            <div className="grid grid-cols-5 gap-3">
              {/* 4 previews */}
              {cycles[cycles.length-1].images.map((u,i)=>(
                <div key={i} className="relative border rounded-xl overflow-hidden">
                  <img src={u} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {/* 5th blurred "26 more" teaser */}
              <div className="relative border rounded-xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 blur-ghost bg-gray-100"></div>
                <div className="relative text-center p-4">
                  <div className="text-xl font-semibold">+26 more pages</div>
                  <div className="text-sm text-gray-600">same style after purchase</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>approveSet(cycles[cycles.length-1])}
                className="px-5 py-3 rounded-xl bg-green-600 text-white">✅ Approve these 4</button>
              <button disabled={!(prompt && cycles.length<CONFIG.MAX_CYCLES)} onClick={()=>{
                track('refresh_clicked', { 
                  cycleIndex: cycles.length,
                  prompt: prompt,
                  totalCycles: cycles.length
                })
                generateCycle('')
              }}
                className="px-5 py-3 rounded-xl border">↻ Refresh 4</button>
            </div>
          </section>
        )}

        {/* Cycle tray (browse previous 5 cycles) */}
        {cycles.length>1 && (
          <section className="space-y-2">
            <h3 className="font-medium">Your previous sets</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {cycles.map((c, index)=>(
                <button key={c.id} onClick={()=>{
                  track('cycle_selected', { 
                    cycleIndex: index + 1, 
                    setId: c.id,
                    wasSelected: selected?.id === c.id
                  })
                  setSelected(c)
                }}
                  className={`border rounded-xl p-1 ${selected?.id===c.id?'ring-2 ring-black':''}`}>
                  <img src={c.images[0]} className="h-24 w-18 object-cover" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Checkout */}
        {selected && (
          <section className="space-y-2">
            <div className="p-4 border rounded-xl bg-gray-50">
              <div className="font-medium">Selected set locked for your child's book</div>
              <div className="text-sm text-gray-600">These exact 4 pages will be included. We'll generate 26 more in the same style after purchase.</div>
            </div>
            <button onClick={()=>{
              track('checkout_button_clicked', { 
                designId: selected.id,
                prompt: prompt,
                totalCycles: cycles.length
              })
              checkout()
            }} disabled={busy}
              className="px-6 py-3 rounded-xl bg-black text-white">Add to cart & checkout</button>
            <div className="text-xs text-gray-500">Guest checkout available. We'll only ask for your email. Accounts are optional. Must be 18+ to purchase.</div>
          </section>
        )}

        <section id="created" className="pt-8">
          <h3 className="text-lg font-semibold mb-2">Popular books created by other parents</h3>
          <div className="text-sm text-gray-500">(Coming soon: pulls from your "top of chart" collection.)</div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto p-4 text-xs text-gray-500">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} ColorMeFree • Designed for adults (18+) to create books for children</div>
          <div className="flex gap-4">
            <a href="privacy.html" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <span>COPPA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
