import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import zxcvbn from 'zxcvbn';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function Register() {
  const profiling_token = localStorage.getItem('profiling_token');

  if (profiling_token) {
    return <Navigate to="/" replace={true} />;
  }

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorInput, setErrorInput] = useState<string>('');
  const [successfulLogin, setSuccessfulLogin] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(5);
  const [credentials, setCredentials] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;

    setUsername(value);
    setPassword(value);

    setCredentials((values) => ({ ...values, [name]: value }));

    console.log(credentials);
  };
  const evaluatePasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    return {
      score: result.score,
      feedback: result.feedback.suggestions,
    };
  };

  const handleRegister = () => {
    const { score } = evaluatePasswordStrength(password);

    if (!username || !password || score < 4)
      return setErrorInput(
        'Please fill in all fields or password must be strong',
      );
    axios
      .post(`${import.meta.env.VITE_PROFILING}/login.php`, {
        ...credentials,
      })
      .then((res: any) => {
        console.log(res.data, 'login successfully');
        if (res.data.status === 'success') {
          setSuccessfulLogin(true);
          // navigate('/login')

          window.setTimeout(() => {
            return navigate('/login');
          }, 5000);
        }
      });
  };

  // navigate to login in 5 seconds

  const handleCheckPassword = (e: ChangeEvent) => {
    const { value } = e.target;

    if (value !== password) {
      setErrorInput('Passwords do not match');
    } else {
      setErrorInput('');
    }
  };

  useEffect(() => {
    if (!successfulLogin) return;

    const countdownInterval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [successfulLogin]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-primary-red text-primary-yellow shadow-slate-400 w-[40%] px-[5rem] h-full flex justify-center items-center flex-col p-4 rounded-md">
        <div className="flex justify-start items-start w-full my-[2rem]">
          <Button onClick={() => navigate('/')}>Go back</Button>
        </div>

        <h1 className="mb-[5rem] font-semibold text-3xl">
          BARANGAY GLAMANG PROFILING SYSTEM
        </h1>

        <Input
          onChange={handleChange}
          className="mb-8 border-4 text-2xl border-primary-yellow rounded-full p-8 w-full text-primary-yellow focus:outline-none placeholder:text-primary-yellow placeholder:text-2xl placeholder:font-semibold"
          placeholder="Fullname"
          name="fullname"
          required
        />
        <Input
          onChange={handleChange}
          className="mb-8 border-4 text-2xl border-primary-yellow rounded-full p-8 w-full text-primary-yellow focus:outline-none placeholder:text-primary-yellow placeholder:text-2xl placeholder:font-semibold"
          placeholder="Username"
          name="username"
          required
        />

        <Input
          className="mb-8 border-4 text-2xl border-primary-yellow rounded-full p-8 w-full text-primary-yellow focus:outline-none placeholder:text-primary-yellow placeholder:text-2xl placeholder:font-semibold"
          type="password"
          onChange={handleChange}
          name="password"
          required
          placeholder="Password"
        />

        <Input
          className="mb-2 border-4 text-2xl border-primary-yellow rounded-full p-8 w-full text-primary-yellow focus:outline-none placeholder:text-primary-yellow placeholder:text-2xl placeholder:font-semibold"
          type="password"
          onChange={handleCheckPassword}
          name="password"
          required
          placeholder="Retype Password"
        />

        {errorInput.length > 0 && (
          <p className="bg-red-500 border-2 my-4 text-white p-2 rounded-md font-semibold">
            {errorInput}
          </p>
        )}

        {password.length > 0 && (
          <PasswordStrengthBar className="w-full my-4" password={password} />
        )}

        <Button className="w-[8rem] p-[2rem] text-2xl" onClick={handleRegister}>
          Register
        </Button>

        {successfulLogin && (
          <div className="my-4 bg-green-500 p-2 text-white rounded-md">
            Registed Successfully, navigating to login page in{' '}
            <span className="font-bold">{seconds}</span> seconds
          </div>
        )}
      </div>
    </div>
  );
}
