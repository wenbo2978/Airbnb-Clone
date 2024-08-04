import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';
import BookingWidget from '../component/BookingWidget';
import MapLink from '../component/MapLink';
import PlacePreviewImg from '../component/PlacePreviewImg';
import PlaceAllImage from '../component/PlaceAllImage';

const PlacePage = () => {
  const {id} = useParams();
  const [place, setPlace] = useState({});
  const [loading, setLoading] = useState(false);
  const[showAllPhotos, setShowAllPhotos] = useState(false);
  
  useEffect(()=>{
    if(!id){
      return;
    }
    setLoading(true);
    axios.get('/places/' + id).then(response => {
      setLoading(false);
      console.log(response.data);
      setPlace(response.data);
    }).catch(error =>{
      setLoading(false);
    });
  }, [id]);
  if(loading){
    return (
      <p>Loading...</p>
    )
  }
  if(showAllPhotos){
    return (
      <PlaceAllImage place={place} onChange={setShowAllPhotos} />
    )
  }

  return (
    <div className='mt-8 bg-gray-100 -mx-8 px-8 pt-8'>
      <h1 className='text-3xl'>{place.title}</h1>
      <MapLink place={place}/>
      <PlacePreviewImg place={place} onChange={setShowAllPhotos}/>
      
      <div className='mt-8 mb-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]'>
          <div>
            <div className='my-4'>
              <h2 className='font-semibold text-2xl'>Description</h2>
              {place.description}
              
            </div>
            Check-in: {place.checkIn} <br/>
            Check-out: {place.checkOut}<br/>
            Max number of guests : {place.maxGuests}
            
          </div>
          <div>
            <BookingWidget place={place}/>
          </div>
      </div>
      <div className='bg-white -mx-8 px-8 py-8 border-t'>
        <div>
          <h2 className='font-semibold text-2xl'>Extra info</h2>
        </div>
        <div className='text-sm text-gray-700 leading-5 mb-4 mt-1'>
          {place.extraInfo}
        </div>
      </div>
    </div>
  )
}

export default PlacePage
