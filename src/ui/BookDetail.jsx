import React from 'react'

const BookDetail = ({ book, onAddToCart, onBack }) => {
  const { title, images, prompt } = book

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600">{prompt}</p>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        {images && images.map((image, index) => (
          <div key={index} className="aspect-square overflow-hidden rounded-lg">
            <img 
              src={image} 
              alt={`${title} page ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center&auto=format&q=80'
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="flex gap-4 justify-center">
        <button 
          onClick={onAddToCart}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          Add to Cart
        </button>
        <button 
          onClick={onBack}
          className="px-8 py-3 rounded-xl border-2 border-purple-300 text-purple-600 font-bold hover:bg-purple-50 transition-all"
        >
          Back to Books
        </button>
      </div>
    </div>
  )
}

export default BookDetail
