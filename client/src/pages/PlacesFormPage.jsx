import React, { useEffect, useState } from 'react'
import Perks from '../component/Perks';
import axios from 'axios';
import PhotosUploader from '../component/PhotosUploader';
import {Navigate, useParams} from 'react-router-dom'

const PlacesFormPage = () => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);
  
  const {id} = useParams();
  console.log("id:" + id);
  useEffect(()=>{
    //console.log('enter useeffect');
    if(!id){
      return;
    }
    axios.get('/places/' + id).then(response=>{
      const {data} = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text){
    return (
      <h2 className='text-2xl mt-4'>{text}</h2>
    );
  }

  function inputDescription(text){
    return (
      <p className='text-gray500 text-sm'>{text}</p>
    );
  }

  function preInput(header, description){
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev){
    ev.preventDefault();
    if(id){
      //update
      const placeData = {
        id,
        title,
        address,
        addedPhotos,
        description,
        perks,
        checkIn,
        checkOut,
        maxGuests,
        extraInfo,
        price
      }
      await axios.put('/places',placeData);
    }else{
      //add new
      const placeData = {
        title,
        address,
        addedPhotos,
        description,
        perks,
        checkIn,
        checkOut,
        maxGuests,
        extraInfo,
        price
      }
      await axios.post('/places',placeData);
    }
    
    setRedirect(true);
  }

  if(redirect){
    //setRedirectToPlacesList(false);
    return <Navigate to={'/account/places'}/>
  }
  return (
    <>
      <div>
          <form onSubmit={savePlace}>
            {preInput('Title', 'Title for your place. should be short and attractively')}
            <input type='text' value={title} onChange={ev=>setTitle(ev.target.value)} placeholder='title, for example: My lovely apt'/>
            {preInput('Address', 'Address to this place')}
            <input type='text' 
              value={address} 
              onChange={ev=>setAddress(ev.target.value)} placeholder='address'
            />
            {preInput('Photos', 'more = better')}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
            {preInput('Description', 'Description of the place')}
            <textarea 
              value={description} 
              onChange={ev=>setDescription(ev.target.value)} 
            />
            {preInput('Perks', 'select all perks in your place')}
            <div className='grid mt-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
              <Perks selected={perks} onChange={setPerks}/>
            </div>
            {preInput('Extra info', 'house rules, etc')}
            <textarea 
              value={extraInfo}
              onChange={ev=>setExtraInfo(ev.target.value)}
            />
            {preInput('Check in&out times, max guests', 'add check in and out times, remember to have some time window for cleaning the room between guests')}
            
            <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-4'>
              <div>
                <h3 className='mt-2 -mb-1'>Check in time</h3>
                <input type='text'placeholder='14:00'
                  value={checkIn}
                  onChange={ev=>setCheckIn(ev.target.value)}
                />
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Check out time</h3>
                <input type='text' placeholder='6:00'
                  value={checkOut}
                  onChange={(ev=>setCheckOut(ev.target.value))}
                />
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Max number of guests</h3>
                <input type='number' placeholder='5'
                  value={maxGuests}
                  onChange={ev=>setMaxGuests(ev.target.value)}
                />
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Price per night</h3>
                <input type='number'
                  value={price}
                  onChange={ev=>setPrice(ev.target.value)}
                />
              </div>
            </div>
            <div>
              <button className='primary my-4'>Save</button>
            </div>
          </form>
        </div>
    </>
  )
}

export default PlacesFormPage
