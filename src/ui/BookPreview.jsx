import React from 'react'

const BookPreview = ({ book }) => {
  const { title, images, prompt, category } = book

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{prompt}</p>
        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-3">
          {category}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 p-4 pt-0">
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
      
      <div className="p-4 pt-0">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Create Your Own
        </button>
      </div>
    </div>
  )
}

export default BookPreview
