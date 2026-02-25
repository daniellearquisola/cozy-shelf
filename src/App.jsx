import './styles.css'
import { books } from './data/books'

function App() {
  return (
    <div className="app">
      <h1>📚 The Cozy Shelf</h1>

      <div className="book-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <span>{book.genre}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App