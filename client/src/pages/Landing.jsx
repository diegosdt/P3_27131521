import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="hero" style={{padding:'4rem 1rem'}}>
      <div className="container">
        <h1>Descubre mundos nuevos a través de las páginas</h1>
        <p>En Letras Vivas encontrarás una cuidadosa selección de libros de todos los géneros.</p>
        <Link to="/" className="btn-hero">Explorar Catálogo</Link>
      </div>
    </div>
  )
}
