function Dashboard({ counts }) {
  return (
    <div className="dashboard">
      <span>📖 Want: {counts.want}</span>
      <span>📚 Reading: {counts.reading}</span>
      <span>✅ Finished: {counts.finished}</span>
    </div>
  )
}

export default Dashboard