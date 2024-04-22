import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

import DOMPurify from 'dompurify';

export default function Settings() {
  // xss payload
  // <img src='nevermind' onerror="alert('HACKED USING XSS');" />

  const [barangayCaptain, setBarangayCaptain] = useState<string>('');
  const [barangaySecretary, setBarangaySecretary] = useState<string>('');
  const [barangayTreasurer, setBarangayTreasurer] = useState<string>('');

  const [barangayName, setBarangayName] = useState<string>('');
  const [barangayAddress, setBarangayAddress] = useState<string>('');
  const secretKey = 'your_secret_key';

  // sanitize dom input
  const sanitizeBarangayName = DOMPurify.sanitize(barangayName);

  const [user_id, setUserId] = useState<string>('');
  const decrypt = () => {
    const user_id = localStorage.getItem('profiling_token') as string;
    const bytes = CryptoJS.AES.decrypt(user_id.toString(), secretKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    console.log(plaintext);
    setUserId(plaintext);

    fetchBarangayOfficials(plaintext);
    fetchBarangayDetails(plaintext);
  };

  const fetchBarangayOfficials = async (user_id: string) => {
    if (user_id === '') return;
    await axios
      .get(`${import.meta.env.VITE_PROFILING}/officials.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data);
        res.data.forEach((official: any) => {
          if (official.official_type === 'Barangay Captain') {
            setBarangayCaptain(official.official_name);
          } else if (official.official_type === 'Barangay Secretary')
            setBarangaySecretary(official.official_name);
          else if (official.official_type === 'Barangay Treasurer')
            setBarangayTreasurer(official.official_name);
        });
      });
  };

  const fetchBarangayDetails = async (user_id: string) => {
    if (user_id === '') return;
    await axios
      .get(`${import.meta.env.VITE_PROFILING}/barangaydetails.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.length > 0) {
          setBarangayName(res.data[0].barangay_name);
          setBarangayAddress(res.data[0].barangay_address);
        } else {
          console.log('No data found');
        }
      });
  };

  useEffect(() => {
    decrypt();

    // Promise.all([fetchBarangayOfficials(), fetchBarangayDetails()]);
  }, []);

  const handleSubmitCaptain = () => {
    axios
      .post(`${import.meta.env.VITE_PROFILING}/officials.php`, {
        official_type: 'Barangay Captain',
        official_name: barangayCaptain,
        user_id: user_id,
      })
      .then((res: any) => {
        console.log(res.data);
        window.location.reload();
      });
  };

  const handleSubmitSecretary = () => {
    axios
      .post(`${import.meta.env.VITE_PROFILING}/officials.php`, {
        official_type: 'Barangay Secretary',
        official_name: barangaySecretary,
        user_id: user_id,
      })
      .then((res: any) => {
        console.log(res.data);
        window.location.reload();
      });
  };

  const handleSubmitTreasurer = () => {
    axios
      .post(`${import.meta.env.VITE_PROFILING}/officials.php`, {
        official_type: 'Barangay Treasurer',
        official_name: barangayTreasurer,
        user_id: user_id,
      })
      .then((res: any) => {
        console.log(res.data);
        window.location.reload();
      });
  };

  const handleSubmitBarangayDetails = () => {
    axios
      .post(`${import.meta.env.VITE_PROFILING}/barangaydetails.php`, {
        barangay_name: barangayName,
        barangay_address: barangayAddress,
        user_id: user_id,
      })
      .then((res: any) => {
        console.log(res.data);
        window.location.reload();
      });
  };
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-4xl my-10">SETTINGS</h1>
      <div className="w-[40rem]">
        <h1 className="font-bold my-5">Barangay Details</h1>

        <div className="flex-col flex">
          <div>
            <Label className="my-2">Barangay Name</Label>
            <Input
              defaultValue={barangayName}
              onChange={(e) => setBarangayName(e.target.value)}
            />
          </div>

          <div dangerouslySetInnerHTML={{ __html: barangayName }} />

          <div>
            <Label className="my-2">Barangay Address</Label>
            <Input
              defaultValue={barangayAddress}
              onChange={(e) => setBarangayAddress(e.target.value)}
            />
          </div>

          <Button
            disabled={barangayName === ''}
            onClick={handleSubmitBarangayDetails}
            type="submit"
            className="my-2 self-end"
          >
            Save
          </Button>
        </div>
      </div>
      <div className="w-[40rem]">
        <h1 className="font-bold my-5">Barangay Officials</h1>

        <div className="flex-col flex">
          <Label className="my-2">Barangay Captain</Label>
          <Input
            defaultValue={barangayCaptain}
            onChange={(e) => setBarangayCaptain(e.target.value)}
          />

          <Button
            disabled={barangayCaptain === ''}
            onClick={handleSubmitCaptain}
            type="submit"
            className="my-2 self-end"
          >
            Save
          </Button>
        </div>

        <div className="flex-col flex">
          <Label className="my-2">Barangay Secretary</Label>
          <Input
            defaultValue={barangaySecretary}
            onChange={(e) => setBarangaySecretary(e.target.value)}
          />
          <Button
            disabled={barangaySecretary === ''}
            onClick={handleSubmitSecretary}
            type="submit"
            className="my-2 self-end"
          >
            Save
          </Button>
        </div>

        <div className="flex-col flex">
          <Label className="my-2">Barangay Treasurer</Label>
          <Input
            defaultValue={barangayTreasurer}
            onChange={(e) => setBarangayTreasurer(e.target.value)}
          />
          <Button
            disabled={barangayTreasurer === ''}
            onClick={handleSubmitTreasurer}
            type="submit"
            className="my-2 self-end"
          >
            Save
          </Button>
        </div>
      </div>
      {/* 
      <div className="w-[40rem]">
        <h1 className="font-bold my-5">Barangay Purok's</h1>

        <div className="w-full flex flex-col">
          <Label className="my-2">Add Purok</Label>
          <Input />
          <Button type="submit" className="my-2 self-end">
            Save
          </Button>
        </div>
      </div> */}
    </div>
  );
}
