function Dashboard({ counts, favoriteCount }) {
  return (
    <div className="dashboard">
      <span>📖 Want: {counts.want}</span>
      <span>📚 Reading: {counts.reading}</span>
      <span>✅ Finished: {counts.finished}</span>
      <p>⭐ Favorites: {favoriteCount}</p>
    </div>
  )
}

export default Dashboard