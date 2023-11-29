import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const defaultUsername = 'admin';
  const defaultPassword = 'admin';

  const handleLogin = () => {
    if (username !== defaultUsername || password !== defaultPassword) {
      return alert('Invalid username or password');
    } else {
      window.location.href = '/';
      localStorage.setItem('isLogin', 'true');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-bold">
          Welcome to Barangay Management System
        </h1>
        <p className="text-lg">Please login to continue</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 mt-5">
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
          className="p-2 border-2 rounded-md outline-none"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="p-2 border-2 rounded-md outline-none"
        />
        <button
          onClick={handleLogin}
          className="p-2 bg-violet-600 text-white rounded-md"
        >
          Login
        </button>
      </div>
    </div>
  );
}
