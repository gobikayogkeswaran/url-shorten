function LinkList({ links, onEdit, onDelete }) {
  if (links.length === 0) {
    return <p>No links created yet.</p>;
  }

  return (
    <div>
      {links.map(link => (
        <div key={link.id} className="link-item">
          <p><strong>Long URL:</strong> <a href={link.longUrl} target="_blank" rel="noopener noreferrer">{link.longUrl}</a></p>
          <p>
            <strong>Short URL:</strong>{' '}
            <a href={`http://localhost:5000/r/${link.slug}`} target="_blank" rel="noopener noreferrer">
              http://localhost:5000/r/{link.slug}
            </a>
          </p>
          <p><strong>Clicks:</strong> {link.clicks}</p>
          <div className="link-actions">
            <button onClick={() => onEdit(link)}>Edit</button>
            <button onClick={() => onDelete(link.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
