import React from 'react'
import { useCart } from '../state/CartContext'
import { useNavigate } from 'react-router-dom'

function Cart(){
  const { items, updateQty, remove, total } = useCart()
  const nav = useNavigate()
  return (
    <div>
      <h2>Carrito</h2>
      {!items.length ? <p>El carrito está vacío</p> : (
        <div>
          {items.map(i=> (
            <div key={i.id} className="cart-row">
              <div>{i.title}</div>
              <div><input type="number" value={i.quantity} min={1} onChange={e=>updateQty(i.id, Number(e.target.value))} /></div>
              <div>${(i.price * i.quantity).toFixed(2)}</div>
              <div><button onClick={()=>remove(i.id)}>Eliminar</button></div>
            </div>
          ))}
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={()=>nav('/checkout')}>Proceder al checkout</button>
        </div>
      )}
    </div>
  )
}
export default Cart