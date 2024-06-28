import React from 'react'
import pizza from './images/pizza.jpg'
import {useNavigate} from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/order')
  }
  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>
      {/* clicking on the img should navigate to "/order" */}
      <img alt="order-pizza" style={{ cursor: 'pointer' }} src={pizza} onClick={handleClick} />
    </div>
  )
}

export default Home
