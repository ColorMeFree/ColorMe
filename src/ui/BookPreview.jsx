import React from 'react'

const BookPreview = ({ book, onClick }) => {
  const { title, images } = book

  return (
    <div 
      className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="grid grid-cols-3 gap-2 mb-3">
        {images && images.slice(0, 3).map((image, index) => (
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
      <h4 className="text-sm font-bold text-gray-800 text-center">{title}</h4>
    </div>
  )
}

export default BookPreview
