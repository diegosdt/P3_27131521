import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

function Register(){
  const [fullName,setFullName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const auth = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await auth.register(fullName,email,password)
      alert('Registrado. Ahora puedes ingresar')
      nav('/login')
    } catch (e) {
      alert('Error en registro: ' + (e.message || e.status))
    } finally { setLoading(false) }
  }

  return (
    <div className="auth">
      <h2>Registro</h2>
      <form onSubmit={submit}>
        <input placeholder="Nombre completo" value={fullName} onChange={e=>setFullName(e.target.value)} />
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading}>{loading? '...' : 'Registrarse'}</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Ingresar</Link></p>
    </div>
  )
}
export default Register
