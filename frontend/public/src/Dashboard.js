import React, { useState, useEffect } from 'react';
import LinkForm from './LinkForm';
import LinkList from './LinkList';

function Dashboard({ userId, onLogout }) {
  const [links, setLinks] = useState([]);

  const fetchLinks = () => {
    fetch('http://localhost:5000/links', {
      headers: { 'x-user-id': userId },
    })
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchLinks();
  }, [userId]);

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/links/${id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId },
    })
      .then(() => fetchLinks())
      .catch(console.error);
  };

  const handleAdd = (newLink) => {
    setLinks(prevLinks => [...prevLinks, newLink]);
  };

  const handleClickUpdate = (slug) => {
    // Update click count for the link with the given slug
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.slug === slug ? { ...link, clicks: link.clicks + 1, lastClick: new Date().toISOString() } : link
      )
    );
  };

  return (
    <div>
      <button onClick={onLogout}>Logout</button>
      <h2>Your Links</h2>
      <LinkForm userId={userId} onAdd={handleAdd} />
      <LinkList links={links} onDelete={handleDelete} onClickUpdate={handleClickUpdate} />
    </div>
  );
}

export default Dashboard;
