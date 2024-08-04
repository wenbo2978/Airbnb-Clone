import React from 'react'

const PlaceAllImage = ({place, onChange}) => {
  return (
    <>
      <div className='absolute inset-0 bg-black text-white min-h-screen'>
        <div className='p-8 grid gap-4 bg-black'>
          <div>
            <h2 className='text-3xl mr-48'>Photos of {place.title}</h2>
            <button 
              className='text-black fixed right-12 top-18 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white'
              onClick={()=>onChange(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Close photos
            </button>
          </div>
        {
          place?.photos?.length > 0 && place.photos.map((photo, index) => (
            <div key={index}>
              <img src={'http://localhost:4000/uploads/' + photo} alt=''/>
            </div>
          ))
        }
        </div>
        
      </div>
    </>
  )
}

export default PlaceAllImage
