import { useContext } from "react"
import BookContext from "./BookContext"

export function useBooks() {
  return useContext(BookContext)
}