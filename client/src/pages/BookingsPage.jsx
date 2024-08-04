import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AccountNav from '../component/AccountNav';
import { Link } from 'react-router-dom';
import BookingDate from '../component/BookingDate';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(()=>{
    axios.get('/bookings').then(response => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav/>
      <div className='flex-col gap-2 flex'>
        {
          bookings && bookings.length > 0 && bookings.map((booking, index) => (
            <Link 
              to={'/account/bookings/'+booking._id}
              key={index} 
              className='flex gap-4 bg-gray-200 rounded-2xl overflow-hidden'>
              <div className='w-40'>
              {
                booking.place?.photos?.[0] && (
                  <img 
                    src={'http://localhost:4000/uploads/'+booking.place.photos[0]} 
                    className='object-cover w-full aspect-square'
                  />
                )
              }
              </div>
              <div className='py-3 pr-3 grow'>
                <h2 className='text-xl'>{booking.place.title}</h2>
                <BookingDate booking={booking} />
                
                
                <div className='text-xl'>
                  <div className='flex gap-1 mt-2 text-xl'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                    <span className='text-2xl'>
                      Total price: ${booking.price}
                    </span>
                    
                  </div>
                </div>
              </div>
              
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default BookingsPage
