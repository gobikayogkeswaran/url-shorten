import React, { useState } from 'react';

function LinkForm({ onAdd }) {
  const [longUrl, setLongUrl] = useState('');
  const [slug, setSlug] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!longUrl) return;
    onAdd(longUrl, slug);
    setLongUrl('');
    setSlug('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Link</h3>
      <input
        type="text"
        placeholder="Long URL"
        value={longUrl}
        onChange={e => setLongUrl(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Custom Slug (optional)"
        value={slug}
        onChange={e => setSlug(e.target.value)}
      />
      <button type="submit">Add Link</button>
    </form>
  );
}

export default LinkForm;
