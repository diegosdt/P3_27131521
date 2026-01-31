import React, { useEffect, useState } from 'react'
import api from '../api'
import { useCart } from '../state/CartContext'

function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const { add } = useCart()

  useEffect(() => { fetchBooks() }, [page])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/books?page=${page}&limit=6&search=${encodeURIComponent(search)}`)
      setBooks(res.books)
      setPages(res.pages || 1)
    } catch (e) {
      console.error(e)
      alert('Error cargando libros')
    } finally { setLoading(false) }
  }

  const onSearch = (e) => { e.preventDefault(); setPage(1); fetchBooks() }

  return (
    <div>
      <h1>Catálogo</h1>
      <form onSubmit={onSearch} className="search">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." />
        <button>Buscar</button>
      </form>
      {loading ? <p>Cargando...</p> : (
        <div className="grid">
          {books.map(b => (
            <article key={b.id} className="card">
              <h3>{b.title}</h3>
              <p className="muted">{b.author} • {b.publisher}</p>
              <p className="price">${b.price}</p>
              <p className="stock">Stock: {b.stock}</p>
              <button onClick={() => add({ id: b.id, title: b.title, price: b.price })}>Agregar al carrito</button>
            </article>
          ))}
        </div>
      )}

      <div className="pagination">
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Anterior</button>
        <span>Página {page} / {pages}</span>
        <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Siguiente</button>
      </div>
    </div>
  )
}

export default Home
