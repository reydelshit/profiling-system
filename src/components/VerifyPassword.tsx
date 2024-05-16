import axios from 'axios';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface DataObject {
  [key: string]: number;
}

export default function VerifyPassword({
  setShowReauth,
  storeDeleteID,
  phpFile,
  deleteIDColumn,
  funcFunction,
}: {
  setShowReauth: (value: boolean) => void;
  storeDeleteID: number;
  phpFile: string;
  deleteIDColumn: string;
  funcFunction?: () => void;
}) {
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const functionVerifyPassword = async () => {
    if (phpFile.length > 0 && deleteIDColumn.length > 0) {
      const dataObject: DataObject = {};
      dataObject[deleteIDColumn] = storeDeleteID;

      await axios
        .delete(`${import.meta.env.VITE_PROFILING}/${phpFile}.php`, {
          data: dataObject,
        })
        .then((res) => {
          console.log(res.data);
          setShowReauth(false);

          if (localStorage.getItem('profiling_reauth') === '0') {
            localStorage.setItem('profiling_reauth', '1');
          }

          funcFunction && funcFunction();
        });
    }
  };

  const handleVerifyPassword = async () => {
    const user_id = localStorage.getItem('profiling_token') as string;

    await axios
      .get(`${import.meta.env.VITE_PROFILING}/reauth.php`, {
        params: { user_id: user_id, password: verifyPassword },
      })
      .then((res) => {
        if (res.data.length > 0) {
          functionVerifyPassword();
        } else {
          setError('Invalid password');
        }
      });
  };

  return (
    <div className="absolute w-full bg-white bg-opacity-75 h-screen py-[5rem] flex justify-center z-30 top-0">
      <div className="bg-white border-2 h-fit mt-[2rem] p-6 rounded-md w-[40%]">
        <div>
          <h1 className="my-2">
            {' '}
            Enter your password again to verify your identity
          </h1>
          <div>
            <Label>Password</Label>
            <Input
              onChange={(e) => setVerifyPassword(e.target.value)}
              name="password"
              className="w-full"
              type="password"
            />
          </div>
        </div>

        {error.length > 0 && <div className="text-red-500">{error}</div>}

        <div className="mt-[2rem]">
          <Button onClick={() => setShowReauth(false)}>Cancel</Button>

          <Button onClick={handleVerifyPassword} className="ml-2">
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}
