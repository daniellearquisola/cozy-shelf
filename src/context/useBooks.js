import { useContext } from "react"
import BookContext from "./BookContext"

export function useBooks() {
  const context = useContext(BookContext)

  const favoriteBooks = context.books.filter(
    book => book.favorite
  )

  return {
    ...context,
    favoriteBooks
  }
}