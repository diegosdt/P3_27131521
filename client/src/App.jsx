import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Landing from './pages/Landing'
import { CartProvider } from './state/CartContext'
import { AuthProvider, useAuth } from './state/AuthContext'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const doLogout = () => {
    logout()
    try { navigate('/') } catch (e) {}
    try { window.location.replace('/landing') } catch (e) { window.location.href = '/landing' }
  }
  return (
    <header className="topbar">
      <Link to="/" className="brand">P3 Bookstore</Link>
      <nav>
        <Link to="/">Catálogo</Link>
        <Link to="/cart">Carrito</Link>
        {user ? (
          <>
            <Link to="/profile/orders">Mis órdenes</Link>
            <button type="button" onClick={doLogout} style={{marginLeft:12}}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </nav>
    </header>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile/orders" element={<Orders />} />
          </Routes>
        </main>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
