
import React, { useState } from 'react';

function LandingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setMessage("");
      alert("Thanks for your feedback! ✨");
    }, 800);
  }
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="liquid-text text-2xl font-bold">
              ViewHub
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="liquid-link">Home</a>
              <a href="#features" className="liquid-link">Features</a>
              <a href="#about" className="liquid-link">About</a>
              <a href="#contact" className="liquid-link">Contact</a>
            </div>
            <button className="liquid-button">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 liquid-text">
              The Future of
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                API Analysis
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Effortlessly transform complex, nested JSON API data into clear, 
              interactive tree structures for instant insight and easier analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="liquid-button text-lg px-8 py-4 animate-pulse-slow">
                Explore Now
              </button>
              <button className="liquid-link text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
        
        
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </section>

      
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 liquid-text">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the next generation of digital interaction with our innovative features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="liquid-card animate-fade-in-left">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 liquid-text">Interactive Tree Navigation & Filtering</h3>
              <p className="text-gray-400 leading-relaxed">
                Allow users to expand/collapse nodes, search for keys or values, and filter specific parts of the JSON structure to focus only on relevant data.
              </p>
            </div>
            
            <div className="liquid-card animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 liquid-text">Live API Testing & Preview</h3>
              <p className="text-gray-400 leading-relaxed">
                Let users enter an API endpoint and instantly fetch real-time JSON data, automatically rendering it into the tree view. Include support for query parameters, headers, and authentication.
              </p>
            </div>
            
            <div className="liquid-card animate-fade-in-right">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 liquid-text">Export & Share Visualizations</h3>
              <p className="text-gray-400 leading-relaxed">
                Enable exporting the JSON tree as interactive diagrams, images, or shareable links so teams can quickly communicate API structures without sharing raw JSON.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section id="contact" className="py-20 px-6 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <h2 className="text-center text-4xl md:text-6xl font-bold mb-6 liquid-text">
              Share Your Feedback
            </h2>
            <p className="text-center text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Tell us what you love, what to improve, or request new features.
            </p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-400">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={5}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition resize-y"
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <button type="submit" className="liquid-button text-lg px-10 py-4 min-w-[200px]" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send Feedback'}
                </button>
                {/* <a href="#features" className="liquid-link text-lg px-10 py-4">
                  View Features
                </a> */}
              </div>
            </form>
          </div>
        </div>
      </section>

     
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="liquid-text text-2xl font-bold mb-6 md:mb-0">
              ViewHub
            </div>
            <div className="flex space-x-8">
              <a href="#" className="liquid-link">Privacy</a>
              <a href="#" className="liquid-link">Terms</a>
              <a href="#" className="liquid-link">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2025 ViewHub.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;