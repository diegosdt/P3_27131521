import React, { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../state/AuthContext'

function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const auth = useAuth()

  useEffect(() => { if (auth.user && auth.user.token) fetchOrders() }, [auth.user])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await api.get('/orders')
      // Respuesta conocida: { status: 'success', data: { count, rows } } o { data: { rows: [...] } } o [{...}]
      const payload = res && res.data ? res.data : res
      // Normalizar respuesta: preferimos payload.rows, luego payload.orders, luego arreglo directo
      const rows = (payload && (payload.rows || payload.orders)) ? (payload.rows || payload.orders) : (Array.isArray(payload) ? payload : (payload && payload.data && Array.isArray(payload.data) ? payload.data : []))
      setOrders(rows)
    } catch (e) {
      // Si la API indica que el token no es válido, limpiamos sesión para forzar login
      if (e && (e.status === 401 || e.status === 403)) {
        alert('Sesión inválida. Debes iniciar sesión de nuevo.')
        auth.logout()
        return
      }
      alert('Error cargando órdenes')
    } finally { setLoading(false) }
  }

  if (!auth.user) return <p>Debes iniciar sesión para ver tus órdenes</p>

  return (
    <div>
      <h2>Mis órdenes</h2>
      {loading ? <p>Cargando...</p> : (
        <div>
          {!orders || !orders.length ? <p>No hay órdenes</p> : (
            <div>
              {orders.map(o => (
                <div key={o.id} className="order">
                  <h3>Orden #{o.id} - ${o.totalAmount} - {o.status}</h3>
                  <ul>
                    {Array.isArray(o.items) && o.items.length ? o.items.map(it => (
                      <li key={it.id}>{(it.product && it.product.title) || (it.Book && it.Book.title) || 'Item'} x {it.quantity} - ${it.unitPrice}</li>
                    )) : <li>Sin items</li>}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default Orders