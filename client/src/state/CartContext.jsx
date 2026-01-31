import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch(e) { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const add = (book) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === book.id)
      if (idx === -1) return [...prev, { ...book, quantity: 1 }]
      const copy = [...prev]
      copy[idx].quantity += 1
      return copy
    })
  }

  const updateQty = (id, qty) => setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const clear = () => setItems([])
  const total = items.reduce((s,i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, add, updateQty, remove, clear, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
