// src/app/auth/reset-request/page.tsx
import { useState } from 'react';
import axios from 'axios';

const ResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/reset-request', { email });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white px-3 py-2 rounded">
          Send Reset Email
        </button>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default ResetRequest;
