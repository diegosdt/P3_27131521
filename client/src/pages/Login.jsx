import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const auth = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await auth.login(email,password)
      nav('/')
    } catch (e) {
      alert('Error en login: ' + (e.message || e.status))
    } finally { setLoading(false) }
  }

  return (
    <div className="auth">
      <h2>Iniciar sesión</h2>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading}>{loading? '...' : 'Ingresar'}</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </div>
  )
}
export default Login
