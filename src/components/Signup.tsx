import React, { useState } from 'react';

type SignupProps = {
  onBack?: () => void;
  onLoginClick?: () => void;
};

export default function Signup({ onBack, onLoginClick }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !email || !password) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Account created (demo)');
    }, 700);
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold liquid-text">Create your account</h1>
          {onBack && (
            <button onClick={onBack} className="liquid-link">Back</button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm text-gray-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition"
            />
          </div>
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
            {isSubmitting ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button className="liquid-link" onClick={onLoginClick}>Sign in</button>
        </div>
      </div>
    </div>
  );
}


