import React, { useState, useEffect } from 'react'
import { createCart, addCustomBookToCart } from '../lib/shopify'
import { track } from '../lib/analytics'

// Popular books for post-purchase upsell
const popularUpsellBooks = [
  { id: 1, title: "Dinosaur Adventure", image: "🦖", price: 19.99, originalPrice: 24.99 },
  { id: 2, title: "Space Explorer", image: "🚀", price: 19.99, originalPrice: 24.99 },
  { id: 3, title: "Ocean Friends", image: "🐠", price: 19.99, originalPrice: 24.99 },
  { id: 4, title: "Fairy Tale Castle", image: "🏰", price: 19.99, originalPrice: 24.99 },
  { id: 5, title: "Jungle Safari", image: "🦁", price: 19.99, originalPrice: 24.99 },
  { id: 6, title: "Robot World", image: "🤖", price: 19.99, originalPrice: 24.99 },
  { id: 7, title: "Princess Dreams", image: "👑", price: 19.99, originalPrice: 24.99 },
  { id: 8, title: "Sports Stars", image: "⚽", price: 19.99, originalPrice: 24.99 },
  { id: 9, title: "Farm Animals", image: "🐄", price: 19.99, originalPrice: 24.99 },
  { id: 10, title: "Superheroes", image: "🦸", price: 19.99, originalPrice: 24.99 },
  { id: 11, title: "Butterfly Garden", image: "🦋", price: 19.99, originalPrice: 24.99 },
  { id: 12, title: "Construction Site", image: "🚧", price: 19.99, originalPrice: 24.99 }
]

export default function CheckoutFlow({ selected, prompt, onClose, onComplete }) {
  const [step, setStep] = useState('checkout') // checkout, processing, success, upsell
  const [cart, setCart] = useState(null)
  const [checkoutUrl, setCheckoutUrl] = useState('')
  const [customerInfo, setCustomerInfo] = useState(null)
  const [upsellCart, setUpsellCart] = useState([])
  const [upsellTotal, setUpsellTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize checkout
  useEffect(() => {
    if (selected && step === 'checkout') {
      initializeCheckout()
    }
  }, [selected, step])

  const initializeCheckout = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Create cart with custom book
      const newCart = await createCart()
      const cartWithBook = await addCustomBookToCart(newCart.id, {
        designId: selected.id,
        prompt: prompt,
        variantGID: process.env.SHOPIFY_VARIANT_GID || 'gid://shopify/ProductVariant/1234567890'
      })
      
      setCart(cartWithBook)
      setCheckoutUrl(cartWithBook.checkoutUrl)
      
      track('checkout_initialized', { 
        designId: selected.id,
        prompt: prompt,
        cartId: cartWithBook.id
      })
      
    } catch (error) {
      console.error('Checkout initialization failed:', error)
      setError('Failed to initialize checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckoutComplete = async (customerData) => {
    setCustomerInfo(customerData)
    setStep('success')
    
    track('purchase_completed', {
      designId: selected.id,
      prompt: prompt,
      customerEmail: customerData.email,
      totalAmount: customerData.totalPrice
    })
    
    // Show upsell after a short delay
    setTimeout(() => {
      setStep('upsell')
    }, 2000)
  }

  const handleUpsellAccept = () => {
    track('upsell_accepted', {
      originalDesignId: selected.id,
      discount: '18%'
    })
    
    // Initialize upsell cart
    setUpsellCart([])
    setUpsellTotal(0)
  }

  const addUpsellBook = (book) => {
    const existingIndex = upsellCart.findIndex(item => item.id === book.id)
    
    if (existingIndex >= 0) {
      // Remove if already added
      const newCart = upsellCart.filter(item => item.id !== book.id)
      setUpsellCart(newCart)
      setUpsellTotal(newCart.reduce((sum, item) => sum + item.price, 0))
    } else {
      // Add to cart
      const newCart = [...upsellCart, book]
      setUpsellCart(newCart)
      setUpsellTotal(newCart.reduce((sum, item) => sum + item.price, 0))
    }
  }

  const checkoutUpsell = async () => {
    if (upsellCart.length === 0) return
    
    setIsLoading(true)
    
    try {
      // Create new cart for upsell items
      const newCart = await createCart()
      
      // Add all upsell books to cart
      for (const book of upsellCart) {
        await addCustomBookToCart(newCart.id, {
          designId: `upsell-${book.id}`,
          prompt: book.title,
          variantGID: process.env.SHOPIFY_VARIANT_GID || 'gid://shopify/ProductVariant/1234567890'
        })
      }
      
      // Apply 18% discount
      const checkoutUrl = new URL(newCart.checkoutUrl)
      checkoutUrl.searchParams.set('discount', 'COLOR18')
      
      // Pre-fill customer information
      if (customerInfo) {
        checkoutUrl.searchParams.set('email', customerInfo.email)
        checkoutUrl.searchParams.set('shipping_address[first_name]', customerInfo.firstName)
        checkoutUrl.searchParams.set('shipping_address[last_name]', customerInfo.lastName)
        checkoutUrl.searchParams.set('shipping_address[address1]', customerInfo.address1)
        checkoutUrl.searchParams.set('shipping_address[city]', customerInfo.city)
        checkoutUrl.searchParams.set('shipping_address[province]', customerInfo.province)
        checkoutUrl.searchParams.set('shipping_address[zip]', customerInfo.zip)
        checkoutUrl.searchParams.set('shipping_address[country]', customerInfo.country)
      }
      
      // Redirect to checkout
      window.location.href = checkoutUrl.toString()
      
      track('upsell_checkout_started', {
        originalDesignId: selected.id,
        upsellBooks: upsellCart.map(b => b.id),
        totalAmount: upsellTotal,
        discount: '18%'
      })
      
    } catch (error) {
      console.error('Upsell checkout failed:', error)
      setError('Failed to process upsell checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const closeUpsell = () => {
    track('upsell_declined', {
      originalDesignId: selected.id
    })
    onComplete()
  }

  // Checkout Step
  if (step === 'checkout') {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Purchase</h2>
              <p className="text-gray-600">You're just moments away from your custom coloring book!</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 mb-6">
                {error}
              </div>
            )}
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-green-800 mb-4">Your Custom Book</h3>
              <div className="flex items-center space-x-4">
                <div className="grid grid-cols-2 gap-2">
                  {selected.images.slice(0, 4).map((img, i) => (
                    <img key={i} src={img} alt="" className="w-16 h-20 object-cover rounded border" />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">"{prompt}"</p>
                  <p className="text-sm text-gray-600">30-page custom coloring book</p>
                  <p className="text-2xl font-bold text-green-600">$24.99</p>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Preparing your checkout...</p>
              </div>
            ) : checkoutUrl ? (
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = checkoutUrl}
                  className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl hover:shadow-xl transition-all"
                >
                  Continue to Secure Checkout
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-8 py-3 rounded-2xl border-2 border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  // Success Step
  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600">Your custom coloring book is being created and will ship soon!</p>
          </div>
        </div>
      </div>
    )
  }

  // Upsell Step
  if (step === 'upsell') {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🎁</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Special Offer Just for You!</h2>
              <p className="text-xl text-gray-600 mb-4">Get 18% off additional coloring books</p>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
                <p className="text-orange-800 font-semibold">
                  🚚 Free shipping on additional books • Same address • One-click checkout
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Popular Books */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Designs Your Child Will Love</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {popularUpsellBooks.map((book) => {
                    const isSelected = upsellCart.some(item => item.id === book.id)
                    return (
                      <button
                        key={book.id}
                        onClick={() => addUpsellBook(book)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? 'border-green-500 bg-green-50 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="text-4xl mb-2">{book.image}</div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">{book.title}</h4>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-lg font-bold text-green-600">${book.price}</span>
                          <span className="text-sm text-gray-400 line-through">${book.originalPrice}</span>
                        </div>
                        {isSelected && (
                          <div className="text-green-600 text-sm font-semibold mt-1">✓ Added</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Checkout Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Books</h3>
                  
                  {upsellCart.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Select books to add to your order</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {upsellCart.map((book) => (
                          <div key={book.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{book.image}</span>
                              <span className="font-medium text-gray-800">{book.title}</span>
                            </div>
                            <span className="font-bold text-green-600">${book.price}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-300 pt-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">Subtotal:</span>
                          <span className="font-bold text-gray-800">${upsellTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-green-600">18% Discount:</span>
                          <span className="text-green-600 font-bold">-${(upsellTotal * 0.18).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="text-green-600 font-bold">FREE</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                          <span>Total:</span>
                          <span>${(upsellTotal * 0.82).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={checkoutUpsell}
                        disabled={isLoading}
                        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {isLoading ? 'Processing...' : `Add ${upsellCart.length} Book${upsellCart.length > 1 ? 's' : ''} & Checkout`}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={closeUpsell}
                    className="w-full px-6 py-3 mt-3 rounded-xl border-2 border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-all"
                  >
                    No Thanks, I'm Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

