import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import AccountNav from '../component/AccountNav';
import axios from 'axios';

const PlacesPage = () => {
  /*const {id} = useParams();
  console.log("id:" + id);*/
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/user-places').then(({data})=>{
      setPlaces(data);
      console.log(data);
    });
  }, []);
  
  
  

  return (
    <div>
      <AccountNav/>
  
        <div className='text-center'>
        
          <Link className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full' to={'/account/places/new'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
            Add new places
          </Link>
        </div>
        <div className='mt-4 flex flex-col gap-2'>
          {
            places && places.length > 0 ? places.map((place, index) => (
              <Link to={'/account/places/' + place._id} key={index} className='flex gap-4 bg-gray-100 p-4 rounded-2xl cursor-pointer'>
                <div className='flex w-32 h-32 bg-gray-300 grow shrink-0'>
                  {
                    place.photos && place.photos.length > 0 &&(
                      <img className='object-cover w-full' src={'http://localhost:4000/uploads/'+place.photos[0]} alt='pic'/>
                    )
                  }
                </div>
                <div className='grow-0 shrink'>
                  <h2 className='text-xl'>{place.title}</h2>
                  <p className='text-sm mt-2'>{place.description}</p>
                </div>
                
              </Link>
            )) : <p>add your places</p>
          }
        </div>
    
     

    </div>
  )
}

export default PlacesPage
