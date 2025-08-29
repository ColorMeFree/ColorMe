import React, { useEffect } from 'react'

const CartSidebar = ({ cartItems, onRemoveItem, onCheckout, isOpen, onClose, onUpdateCartItems }) => {
  const totalItems = cartItems.length
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 19.99), 0)

  // Load cart from cookies on component mount
  useEffect(() => {
    const savedCart = getCartFromCookies()
    if (savedCart && savedCart.length > 0) {
      onUpdateCartItems(savedCart)
    }
  }, [])

  // Save cart to cookies whenever cartItems changes
  useEffect(() => {
    if (cartItems.length > 0) {
      saveCartToCookies(cartItems)
    } else {
      clearCartCookies()
    }
  }, [cartItems])

  // Auto-open cart when items are added
  useEffect(() => {
    if (cartItems.length > 0 && !isOpen) {
      // Small delay to ensure smooth UX
      setTimeout(() => {
        // We'll handle this in the parent component
      }, 100)
    }
  }, [cartItems.length, isOpen])

  const getCartFromCookies = () => {
    try {
      const cartCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('colorbook_cart='))
      
      if (cartCookie) {
        const cartData = cartCookie.split('=')[1]
        return JSON.parse(decodeURIComponent(cartData))
      }
    } catch (error) {
      console.error('Error loading cart from cookies:', error)
    }
    return []
  }

  const saveCartToCookies = (items) => {
    try {
      const cartData = JSON.stringify(items)
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      document.cookie = `colorbook_cart=${encodeURIComponent(cartData)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    } catch (error) {
      console.error('Error saving cart to cookies:', error)
    }
  }

  const clearCartCookies = () => {
    document.cookie = 'colorbook_cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Cart Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-md border-l border-purple-200 shadow-xl transform transition-transform duration-500 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Shopping Cart</h2>
            <button 
              onClick={onClose}
              className="text-purple-500 hover:text-purple-700 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {totalItems === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🛒</div>
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shadow-sm">
                      <img 
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80'} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-800">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.prompt}</p>
                      <p className="text-sm font-bold text-green-600">${item.price || 19.99}</p>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-purple-200 p-4 bg-gradient-to-r from-purple-50 to-pink-50">
            {totalItems > 0 && (
              <div className="mb-4">
                {/* Discount Message */}
                <div className="text-center mb-3">
                  <p className="text-sm italic text-purple-600 font-medium">✨ Discounts applied at checkout</p>
                </div>
                
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal ({totalItems} items):</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Shipping:</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-purple-200 pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={onCheckout}
              disabled={totalItems === 0}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${
                totalItems === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg'
              }`}
            >
              {totalItems === 0 ? 'Cart Empty' : 'Checkout Now & See Our Discounts'}
            </button>
            
            {totalItems > 0 && (
              <p className="text-xs text-center text-gray-500 mt-2">
                Secure checkout powered by Shopify
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default CartSidebar
