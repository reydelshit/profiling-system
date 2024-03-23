import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export default function VerifyPassword({
  setShowReauth,
  storeDeleteID,
}: {
  setShowReauth: (value: boolean) => void;
  storeDeleteID: number;
}) {
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const secretKey = 'your_secret_key';

  const handleVerifyPassword = () => {
    const user_id = localStorage.getItem('profiling_token') as string;
    // const ciphertext = CryptoJS.AES.encrypt(
    //   verifyPassword,
    //   secretKey,
    // ).toString();

    const bytes = CryptoJS.AES.decrypt(user_id.toString(), secretKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    axios
      .get(`${import.meta.env.VITE_PROFILING}/reauth.php`, {
        params: { user_id: plaintext, password: verifyPassword },
      })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          axios
            .delete(`${import.meta.env.VITE_PROFILING}/household.php`, {
              data: { house_id: storeDeleteID },
            })
            .then((res) => {
              console.log(res.data);
              setShowReauth(false);

              localStorage.setItem('profiling_reauth', '1');
            });
        }

        console.log(res.data);
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
