import React, { useContext, useState } from 'react'
import { UserContext } from '../contexts/UserContext'
import {Link, Navigate, useParams} from 'react-router-dom'
import axios from 'axios';
import PlacesPage from './PlacesPage';
import AccountNav from '../component/AccountNav';

const AccountPage = () => {
  const {ready, user, setUser} = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  let {subpage} = useParams();

  if(!ready){
    return 'Loading...';
  }

  if(ready && !user && !redirect){
    
    return <Navigate to={'/login'}/>
  }

  //console.log(subpage);
  if(subpage === undefined)
      subpage = 'profile';
  /* should move
  function linkClasses(type = null){
    let res = 'inline-flex gap-1 py-2 px-6 rounded-full';
    if(type === subpage){
      res += ' bg-primary text-white'
    }else {
      res += ' bg-gray-300'
    }
    return res;
  }*/

  async function logout(){
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }

  if(redirect){
    return <Navigate to={redirect}/>
  }

  return (
    <div>
      <AccountNav />
      {
        subpage === 'profile' && (
          <div className='text-center max-w-lg mx-auto'>
            Logged in as {user.name} ({user.email}) <br />
            <button onClick={logout} className='primary mt-2 max-w-sm'>Logout</button>
          </div>
        )
      }
      {
        subpage === 'places' && (
          <PlacesPage />
        )
      }
    </div>
  )
}

export default AccountPage
