import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='text-white flex justify-between items-center mt-2 sm:mt-4 relative z-50'>
      <h1 className='text-2xl sm:text-3xl md:text-4xl text-white ml-2 sm:ml-4'>
        Gym Guide
      </h1>
      <div className='text-right space-x-2 sm:space-x-4 mr-1 sm:mr-2'>
        <Link 
          className='btn btn-ghost px-2 sm:px-4 h-8 sm:h-10 min-h-0 text-sm sm:text-base relative z-50' 
          to='/'
        > 
          Home
        </Link>
        <Link 
          className='btn btn-ghost px-2 sm:px-4 h-8 sm:h-10 min-h-0 text-sm sm:text-base relative z-50' 
          to='/profile'
        > 
          Profile
        </Link>
      </div>
    </div>
  );
}

export default Navbar