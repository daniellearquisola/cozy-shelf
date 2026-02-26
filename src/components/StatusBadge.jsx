function StatusBadge({ status }) {
  if (status === "want") return <span className="badge want">📖 Want to Read</span>
  if (status === "reading") return <span className="badge reading">📚 Reading</span>
  if (status === "finished") return <span className="badge finished">✅ Finished</span>

  return null
}

export default StatusBadge