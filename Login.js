const { useState } = React;

function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        onLogin(data.userId);
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <p>
        Don't have an account?{' '}
        <button onClick={onSwitch} disabled={loading} style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0}}>
          Sign up
        </button>
      </p>
    </div>
  );
}
