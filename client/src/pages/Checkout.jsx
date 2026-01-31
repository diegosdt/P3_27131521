import React, { useState } from 'react'
import { useCart } from '../state/CartContext'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

function Checkout(){
  const { items, total, clear } = useCart()
  const [loading,setLoading] = useState(false)
  const [card, setCard] = useState({ fullName: '', number: '', cvv: '', expMonth: '', expYear: '' })
  const nav = useNavigate()
  const { user } = useAuth()

  // Protección de ruta: requiere sesión
  if (!user) {
    nav('/login')
    return null
  }

  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const payload = {
        items: items.map(i=>({ productId: i.id, quantity: i.quantity })),
        paymentMethod: 'CreditCard',
        paymentDetails: { ...card }
      }
      const res = await api.post('/orders', payload)
      alert('Compra exitosa')
      clear()
      nav('/profile/orders')
    } catch (e) {
      const msg = (e && e.body && e.body.message) || e.message || 'Error procesando pago'
      if (e && e.status === 402) alert('Pago rechazado: ' + msg)
      else alert('Error: ' + msg)
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2>Checkout</h2>
      {!items.length ? <p>El carrito está vacío</p> : (
        <div>
          <h3>Resumen</h3>
          <ul>
            {items.map(i=> <li key={i.id}>{i.title} x {i.quantity} - ${(i.price*i.quantity).toFixed(2)}</li>)}
          </ul>
          <h4>Total: ${total.toFixed(2)}</h4>
          <form onSubmit={submit} className="auth">
            <input placeholder="Nombre completo (titular)" value={card.fullName} onChange={e=>setCard({...card, fullName: e.target.value})} />
            <input placeholder="Número de tarjeta" value={card.number} onChange={e=>setCard({...card, number: e.target.value})} />
            <input placeholder="CVV" value={card.cvv} onChange={e=>setCard({...card, cvv: e.target.value})} />
            <input placeholder="MM" value={card.expMonth} onChange={e=>setCard({...card, expMonth: e.target.value})} />
            <input placeholder="YYYY" value={card.expYear} onChange={e=>setCard({...card, expYear: e.target.value})} />
            <button disabled={loading}>{loading? 'Procesando...' : 'Pagar'}</button>
          </form>
        </div>
      )}
    </div>
  )
}
export default Checkout