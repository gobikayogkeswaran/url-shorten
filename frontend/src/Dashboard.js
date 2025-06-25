import React, { useState, useEffect } from 'react';
import LinkForm from './LinkForm';
import LinkList from './LinkList';

function Dashboard({ userId, onLogout }) {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState('');

  async function fetchLinks() {
    try {
      const res = await fetch('http://localhost:5000/links', {
        headers: { 'x-user-id': userId },
      });
      const data = await res.json();
      if (res.ok) {
        setLinks(data);
      } else {
        setError(data.message || 'Failed to fetch links');
      }
    } catch (err) {
      setError('Server error');
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function handleAddLink(longUrl, slug) {
    setError('');
    try {
      const res = await fetch('http://localhost:5000/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ longUrl, slug }),
      });
      const data = await res.json();
      if (res.ok) {
        setLinks(prev => [...prev, data]);
      } else {
        setError(data.message || 'Failed to add link');
      }
    } catch (err) {
      setError('Server error');
    }
  }

  async function handleDeleteLink(id) {
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/links/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId },
      });
      if (res.ok) {
        setLinks(prev => prev.filter(link => link._id !== id && link.id !== id));
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete link');
      }
    } catch (err) {
      setError('Server error');
    }
  }

  async function handleUpdateLink(id, longUrl, slug) {
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ longUrl, slug }),
      });
      const data = await res.json();
      if (res.ok) {
        setLinks(prev => prev.map(link => (link._id === id || link.id === id ? data : link)));
      } else {
        setError(data.message || 'Failed to update link');
      }
    } catch (err) {
      setError('Server error');
    }
  }

  return (
    <div>
      <h2>Your Links</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="logout-container">
        <button onClick={onLogout}>Logout</button>
      </div>
      <LinkForm onAdd={handleAddLink} />
      <LinkList
        links={links}
        onDelete={handleDeleteLink}
        onUpdate={handleUpdateLink}
        userId={userId}
      />
    </div>
  );
}

export default Dashboard;
