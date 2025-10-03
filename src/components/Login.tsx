import React, { useState } from 'react';

type LoginProps = {
  onBack?: () => void;
  onSignupClick?: () => void;
  onSuccess?: () => void;
};

export default function Login({ onBack, onSignupClick, onSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      console.log("Enter valid credentials.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/auth/Signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: email,password: password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Store JWT on success
      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        // Optional: Store user info
        // localStorage.setItem('user', JSON.stringify(data.user));
        
        alert('Logged in successfully!');
        if (onSuccess) onSuccess();
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.log("Error from UI in login.");
      console.log(err);
      alert('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold liquid-text">Welcome back</h1>
          {onBack && (
            <button onClick={onBack} className="liquid-link">Back</button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition"
            />
          </div>
          <button type="submit" className="liquid-button w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button className="liquid-link" onClick={onSignupClick}>Create one</button>
        </div>
      </div>
    </div>
  );
}


