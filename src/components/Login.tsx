import axios from 'axios';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import CryptoJS from 'crypto-js';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function Login() {
  const profiling_token = localStorage.getItem('profiling_token');
  const secretKey = 'your_secret_key';
  if (profiling_token) {
    return <Navigate to="/" replace={true} />;
  }

  const [errorInput, setErrorInput] = useState<string>('');

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;

    setCredentials((values) => ({ ...values, [name]: value }));

    console.log(credentials);
  };
  const encrypt = (encrypt: string) => {
    const ciphertext = CryptoJS.AES.encrypt(encrypt, secretKey).toString();

    localStorage.setItem('profiling_token', ciphertext);
  };
  const handleLogin = () => {
    if (!credentials.username || !credentials.password)
      return setErrorInput('Please fill in all fields');

    axios
      .get(`${import.meta.env.VITE_PROFILING}/login.php`, {
        params: {
          credentials,
        },
      })
      .then((res) => {
        console.log(res.data);
        encrypt(res.data[0].user_id.toString());
        localStorage.setItem('profiling_reauth', '0');

        if (res.data[0].user_id) {
          window.location.href = '/';
        }
      })
      .catch((error) => {
        console.error('Error occurred during login:', error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="mb-[7rem] font-semibold text-3xl">
          BARANGAY GLAMANG PROFILING SYSTEM
        </h1>
        {/* <Label className="mb-1 self-start text-sm">Username</Label> */}
        <Input
          onChange={handleChange}
          className="mb-8 border-4 text-2xl border-primary-yellow rounded-full p-8 w-full text-primary-yellow focus:outline-none placeholder:text-primary-yellow placeholder:text-2xl placeholder:font-semibold"
          placeholder="Username"
          name="username"
          required
        />

        {/* <Label className="mb-1 self-start text-sm">Password</Label> */}
        <Input
          className="mb-2 border-4 text-2xl border-primary-yellow rounded-full p-8 w-full text-primary-yellow focus:outline-none placeholder:text-primary-yellow placeholder:text-2xl placeholder:font-semibold"
          type="password"
          onChange={handleChange}
          name="password"
          placeholder="Password"
          required
        />

        <div className="w-full text-end px-2">
          <a href="/register" className="text-[1.2rem] underline">
            Create an account
          </a>
        </div>
        <Button className="w-[8rem] p-[2rem] text-2xl" onClick={handleLogin}>
          Login
        </Button>
        {errorInput && (
          <p className="text-primary-red border-2 bg-white p-2 rounded-md font-semibold">
            {errorInput}
          </p>
        )}
      </div>
    </div>
  );
}
