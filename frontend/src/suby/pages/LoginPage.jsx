import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:4000/auth/login', { email, password })
      console.log(response.data)
      localStorage.setItem('userToken', response.data.token)
      localStorage.setItem('username', response.data.username)
      navigate(response.data.redirectUrl)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <p>New user? <Link to="/signup">Register here</Link></p>
      </form>
    </div>
  )
}

export default LoginPage
