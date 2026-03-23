import { useContext } from "react"
import BookContext from "./BookContext"

export function useBooks() {
  const context = useContext(BookContext)

  if (!context) {
    throw new Error("useBooks must be used within BookProvider")
  }

  return context
}