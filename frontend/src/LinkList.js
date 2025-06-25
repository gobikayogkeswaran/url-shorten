import React, { useState } from 'react';

function LinkList({ links, onDelete, onUpdate, userId }) {
  const [editingId, setEditingId] = useState(null);
  const [editLongUrl, setEditLongUrl] = useState('');
  const [editSlug, setEditSlug] = useState('');

  function startEdit(link) {
    setEditingId(link._id || link.id);
    setEditLongUrl(link.longUrl);
    setEditSlug(link.slug);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditLongUrl('');
    setEditSlug('');
  }

  function saveEdit() {
    onUpdate(editingId, editLongUrl, editSlug);
    cancelEdit();
  }

  return (
    <div>
      {links.map(link => (
        <div key={link._id || link.id} className="link-item">
          {editingId === (link._id || link.id) ? (
            <>
              <input
                type="text"
                value={editLongUrl}
                onChange={e => setEditLongUrl(e.target.value)}
              />
              <input
                type="text"
                value={editSlug}
                onChange={e => setEditSlug(e.target.value)}
              />
              <button onClick={saveEdit}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <p>
                Long URL:{' '}
                <a href={link.longUrl} target="_blank" rel="noopener noreferrer">
                  {link.longUrl}
                </a>
              </p>
              <p>
                Short URL:{' '}
                <a href={`http://localhost:5000/r/${link.slug}`} target="_blank" rel="noopener noreferrer">
                  {`http://localhost:5000/r/${link.slug}`}
                </a>
              </p>
              <p>Clicks: {link.clicks}</p>
              <div className="link-actions">
                <button onClick={() => startEdit(link)}>Edit</button>
                <button onClick={() => onDelete(link._id || link.id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default LinkList;
