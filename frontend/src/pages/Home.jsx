import React from 'react'
import {Link} from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <div className="h-screen bg-[url(https://images.unsplash.com/photo-1557404763-69708cd8b9ce?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww)]
      bg-cover bg-center w-full flex justify-between pt-8  flex-col">
        <img className='w-16 ml-8' src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'/>
        <div className='bg-white py-4 px-4 pb-7'>
            <h2 className='text-3xl font-bold'>Get Started with Uber</h2>
            <Link to='/login' className='w-full flex items-center justify-center bg-black text-white py-3 rounded mt-5'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
