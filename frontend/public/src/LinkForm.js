const { useState, useEffect } = React;

function LinkForm({ onSubmit, editingLink, onCancel }) {
  const [longUrl, setLongUrl] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (editingLink) {
      setLongUrl(editingLink.longUrl);
      setSlug(editingLink.slug);
    } else {
      setLongUrl('');
      setSlug('');
    }
  }, [editingLink]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!longUrl.trim()) return;
    onSubmit({ id: editingLink ? editingLink.id : undefined, longUrl: longUrl.trim(), slug: slug.trim() });
  }

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">{editingLink ? 'Update Link' : 'Create Link'}</button>
      {editingLink && <button type="button" onClick={onCancel} style={{marginLeft: '10px'}}>Cancel</button>}
    </form>
  );
}
