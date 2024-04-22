import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import axios from 'axios';
import CryptoJS from 'crypto-js';

interface DataObject {
  [key: string]: number;
}

export default function VerifyPassword({
  setShowReauth,
  storeDeleteID,
  phpFile,
  deleteIDColumn,
  decrypt,
}: {
  setShowReauth: (value: boolean) => void;
  storeDeleteID: number;
  phpFile: string;
  deleteIDColumn: string;
  decrypt?: () => void;
}) {
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const secretKey = 'your_secret_key';
  const [error, setError] = useState<string>('');

  const deleteTable = async () => {
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

          decrypt && decrypt();
        });
    }
  };

  const handleVerifyPassword = async () => {
    const user_id = localStorage.getItem('profiling_token') as string;

    const bytes = CryptoJS.AES.decrypt(user_id.toString(), secretKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    await axios
      .get(`${import.meta.env.VITE_PROFILING}/reauth.php`, {
        params: { user_id: plaintext, password: verifyPassword },
      })
      .then((res) => {
        if (res.data.length > 0) {
          deleteTable();
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
