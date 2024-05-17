import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import moment from 'moment';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function Login() {
  const profiling_token = localStorage.getItem('profiling_token');
  const [errorInput, setErrorInput] = useState<string>('');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [disabledFiveMinutes, setDisabledFiveMinutes] =
    useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [warningText, setWarningText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (remainingTime > 0) {
      setDisabledFiveMinutes(true);
      const timer = setTimeout(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setDisabledFiveMinutes(false);
      localStorage.removeItem('login_attempt');
    }
  }, [remainingTime]);

  if (profiling_token) {
    return <Navigate to="/" replace={true} />;
  }

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;

    setCredentials((values) => ({ ...values, [name]: value }));

    console.log(credentials);
  };

  const handleLogin = () => {
    if (!credentials.username || !credentials.password)
      return setErrorInput('Please fill in all fields');

    // if (randomStringInput !== randomString) {
    //   return setErrorInput('Verification failed. Please try again.');
    // }

    const loginAttempt = localStorage.getItem('login_attempt');

    axios
      .get(`${import.meta.env.VITE_PROFILING}/login.php`, {
        params: credentials,
      })
      .then((res) => {
        if (res.data.length === 0) {
          if (loginAttempt) {
            const newLoginAttempt = parseInt(loginAttempt) + 1;
            localStorage.setItem('login_attempt', newLoginAttempt.toString());
            if (newLoginAttempt > 3) {
              // alert();

              setDisabledFiveMinutes(true);
              setRemainingTime(20);
              setWarningText('You have reached the maximum login attempt.');
              setErrorInput('');
            } else {
              setErrorInput(
                'Invalid username or password. You have ' +
                  (4 - newLoginAttempt) +
                  ' attempts left',
              );
              // alert('Invalid username or password');
            }
          } else {
            localStorage.setItem('login_attempt', '1');
            // alert('Invalid username or password');
            setErrorInput('Invalid username or password');
          }
        } else {
          console.log(res.data);
          localStorage.setItem('profiling_token', res.data[0].user_id);
          localStorage.setItem('profiling_reauth', '0');

          toast({
            style: { background: '#1A4D2E', color: 'white' },
            title: 'Login Successfully 🎉',
            description: moment().format('LLLL'),
          });

          // if (res.data[0].user_id) {
          //   window.location.href = '/';
          // }
        }
      })
      .catch((error) => {
        console.error('Error occurred during login:', error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-2 w-[38rem]">
        <h1 className="mb-[7rem] font-bold text-6xl text-center">
          BARANGAY PROFILING SYSTEM
        </h1>
        {/* <Label className="mb-1 self-start text-sm">Username</Label> */}
        <Input
          onChange={handleChange}
          className="mb-8 border-4  text-2xl rounded-full p-8 w-full text-primary-yellow focus:outline-none placeholder:text-primary-yellow placeholder:text-2xl placeholder:font-semibold"
          placeholder="Username"
          name="username"
          required
        />

        {/* <Label className="mb-1 self-start text-sm">Password</Label> */}
        <Input
          className="mb-2 border-4 text-2xl rounded-full p-8 w-full text-primary-yellow focus:outline-none placeholder:text-primary-yellow placeholder:text-2xl placeholder:font-semibold"
          type="password"
          onChange={handleChange}
          name="password"
          placeholder="Password"
          required
        />

        {/* <div className="w-full block">
          <div className="flex bg-gray-200 my-4 items-center justify-between rounded-md p-2">
            <span className="font-semibold text-2xl tracking-[1.5rem]">
              {randomString}
            </span>
            <Button onClick={() => generateRandomString()}>Refresh</Button>
          </div>

          <Input
            className="my-2 border-4 text-2xl rounded-full p-8 w-full text-primary-yellow focus:outline-none placeholder:text-primary-yellow placeholder:text-2xl placeholder:font-semibold"
            type="text"
            onChange={(e) => setRandomStringInput(e.target.value)}
            placeholder="Verify"
            required
          />
        </div> */}

        <div className="w-full text-end px-2">
          <a href="/register" className="text-[1.2rem] underline">
            Create an account
          </a>
        </div>

        <Button
          disabled={disabledFiveMinutes}
          className={`w-[8rem] p-[2rem] text-2xl ${
            disabledFiveMinutes ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={handleLogin}
        >
          Login
        </Button>
        {errorInput ? (
          <p className="text-red-600  bg-white p-2 rounded-md font-semibold">
            {errorInput}
          </p>
        ) : null}

        {warningText && remainingTime != 0 ? (
          <p className=" bg-white p-2 rounded-md font-semibold flex flex-col items-center">
            <div className="blob"></div>
            {warningText}
            <span className="bg-red-600 text-white p-2 rounded-md">
              Remaining time: {remainingTime}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
