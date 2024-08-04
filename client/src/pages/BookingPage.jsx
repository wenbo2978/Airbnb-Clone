import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MapLink from '../component/MapLink';
import PlaceAllImage from '../component/PlaceAllImage';
import PlacePreviewImg from '../component/PlacePreviewImg';
import { differenceInCalendarDays, format } from 'date-fns';
import BookingDate from '../component/BookingDate';

const BookingPage = () => {
  const {id} = useParams();
  const [booking, setBooking] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  useEffect(()=>{
    if(id){
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.filter(({_id})=> _id === id);
        if(foundBooking)
          setBooking(foundBooking?.[0]);
          //console.log(foundBooking?.[0]);
      });
    }
  }, [id]);

  if(!booking){
    return <p>Loading..............</p>;
  }

  if(showAllPhotos){
    return <PlaceAllImage place={booking.place} onChange={setShowAllPhotos}/>
  }

  return (
    <div className='my-8'>
      <h1 className='text-3xl'>{booking.place.title}</h1>
      <MapLink place={booking.place} />
      <div className='bg-gray-200 p-4 mb-4 rounded-2xl flex justify-between items-center'>
        <div className='grow pr-3'> 
          <h2 className='text-2xl mb-4'>Your booking information:</h2>
          <BookingDate booking={booking} />
        </div>
        <div className='bg-primary p-6 text-white rounded-2xl'>
          <div>Total price</div>
          <div className='text-3xl'>${booking.price}</div>
        </div>
      </div>
      <PlacePreviewImg place={booking.place} onChange={setShowAllPhotos} />
    </div>
  )
}

export default BookingPage
