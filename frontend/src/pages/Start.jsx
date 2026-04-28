import React from 'react'
import {Link} from 'react-router-dom'
import logo from '../assets/image.png'

const Start = () => {
  return (
    <div>
      <div className="h-screen bg-[url(https://images.unsplash.com/photo-1557404763-69708cd8b9ce?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww)]
      bg-cover bg-center w-full flex justify-between pt-8  flex-col">
        <img
          className='w-30 ml-4  bg-transparent mix-blend-darken object-contain scale-[1.08] '
          src={logo}
          alt="RideX Logo"
        />
        <div className='bg-white py-4 px-4 pb-7'>
            <h2 className='text-3xl font-bold'>Get Started with RideX</h2>
            <Link to='/login' className='w-full flex items-center justify-center bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start
