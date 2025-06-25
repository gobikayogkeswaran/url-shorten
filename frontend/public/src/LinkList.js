function LinkList({ links, onDelete, onClickUpdate }) {
  if (links.length === 0) {
    return <p>No links created yet.</p>;
  }

  const handleShortLinkClick = (slug) => {
    onClickUpdate(slug);
  };

  return (
    <ul>
      {links.map(link => (
        <li key={link.id} className="link-item">
          <div>
            <a href={link.longUrl} target="_blank" rel="noopener noreferrer">
              {link.longUrl}
            </a>
          </div>
          <div>
            Short Link: <a href={`/r/${link.slug}`} target="_blank" rel="noopener noreferrer" onClick={() => handleShortLinkClick(link.slug)}>/r/{link.slug}</a>
          </div>
          <div>Clicks: {link.clicks}</div>
          <div>Last Click: {link.lastClick ? new Date(link.lastClick).toLocaleString() : 'N/A'}</div>
          <div className="link-actions">
            <button onClick={() => onDelete(link.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default LinkList;
