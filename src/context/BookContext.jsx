import { createContext, useState, useEffect } from "react"
import { books as initialBooks } from "../data/books"

const BookContext = createContext()

export function BookProvider({ children }) {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books")
    return savedBooks ? JSON.parse(savedBooks) : initialBooks
  })

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books))
  }, [books])

  useEffect(() => {
    async function fetchBooks() {
      const response = await fetch(
        "https://openlibrary.org/search.json?q=fantasy"
      )

      const data = await response.json()

      const apiBooks = data.docs.slice(0, 20).map((book, index) => ({
        id: `api-${index}`,
        title: book.title,
        author: book.author_name?.[0] || "Unknown",
        genre: "Fantasy",
        status: "want",
        favorite: false
      }))

      setBooks(prev => {
        const alreadyHasApiBooks = prev.some(book =>
          String(book.id).startsWith("api-")
        )

        if (alreadyHasApiBooks) {
          return prev
        }

        return [...prev, ...apiBooks]
      })
    }

    fetchBooks()
  }, [])

  function addBook(book) {
    setBooks(prev => {
      const alreadyExists = prev.some(
        b => b.title === book.title && b.author === book.author
      )
      if (alreadyExists) return prev
      return [...prev, book]
    })
  }

  function removeBook(id) {
    setBooks(prev => prev.filter(book => book.id !== id))
  }

  function toggleFavorite(id) {
    setBooks(prev =>
      prev.map(book =>
        book.id === id
          ? { ...book, favorite: !book.favorite }
          : book
      )
    )
  }

  function handleUpdateStatus(id, newStatus) {
    setBooks(prev =>
      prev.map(book =>
        book.id === id
          ? { ...book, status: newStatus }
          : book
      )
    )
  }

  return (
    <BookContext.Provider
      value={{
        books,
        addBook,
        removeBook,
        toggleFavorite,
        handleUpdateStatus
      }}
    >
      {children}
    </BookContext.Provider>
  )
}

export default BookContext