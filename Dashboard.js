const { useState, useEffect } = React;

function Dashboard({ userId, onLogout }) {
  const [links, setLinks] = useState([]);
  const [editingLink, setEditingLink] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchLinks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/links', {
        headers: { 'x-user-id': userId }
      });
      if (!res.ok) {
        setError('Failed to fetch links');
        setLinks([]);
      } else {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      setError('Network error');
      setLinks([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function handleCreateOrUpdate(link) {
    setError(null);
    try {
      const method = link.id ? 'PUT' : 'POST';
      const url = link.id ? `http://localhost:5000/links/${link.id}` : 'http://localhost:5000/links';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify(link)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to save link');
      } else {
        setEditingLink(null);
        fetchLinks();
      }
    } catch (err) {
      setError('Network error');
    }
  }

  async function handleDelete(id) {
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/links/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId }
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to delete link');
      } else {
        fetchLinks();
      }
    } catch (err) {
      setError('Network error');
    }
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={onLogout} style={{float: 'right', marginBottom: '10px'}}>Logout</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <LinkForm onSubmit={handleCreateOrUpdate}
       editingLink={editingLink} 
       onCancel={() => setEditingLink(null)} />
      {loading ? <p>Loading...</p> : <LinkList links={links} 
      onEdit={setEditingLink} onDelete={handleDelete} />}
    </div>
  );
}
