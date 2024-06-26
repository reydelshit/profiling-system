import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import DOMPurify from 'dompurify';

import md5 from 'md5';
import moment from 'moment';
import { useToast } from './ui/use-toast';
import useLog from './useLog';
import { Link } from 'react-router-dom';

type ProfileType = {
  user_id: string;
  username: string;
  password: string;
  created_at: string;
  fullname: string;
};

export default function BarangayProfile() {
  // xss payload
  // <img src='nevermind' onerror="alert('HACKED USING XSS');" />

  const [barangayName, setBarangayName] = useState<string>('');

  // sanitize dom input
  const sanitizeBarangayName = DOMPurify.sanitize(barangayName);

  const [barangayCaptain, setBarangayCaptain] = useState<string>('');
  const [barangaySecretary, setBarangaySecretary] = useState<string>('');
  const [barangayTreasurer, setBarangayTreasurer] = useState<string>('');

  const [barangayAddress, setBarangayAddress] = useState<string>('');

  const user_id = localStorage.getItem('profiling_token') as string;

  const fetchBarangayOfficials = () => {
    if (user_id === '') return;
    axios
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

  const fetchBarangayDetails = () => {
    if (user_id === '') return;
    axios
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
    Promise.all([fetchBarangayOfficials(), fetchBarangayDetails()]);
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

        useLog(
          `You have added barangay captain ${barangayCaptain}`,
          'Add',
        ).handleUploadActivityLog();
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

        useLog(
          `You have added barangay secretary ${barangaySecretary}`,
          'Add',
        ).handleUploadActivityLog();
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

        useLog(
          `You have added barangay treasurer ${barangayTreasurer}`,
          'Add',
        ).handleUploadActivityLog();
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

        useLog(
          `You have submitted barangay details `,
          'Add',
        ).handleUploadActivityLog();
      });
  };

  return (
    <div className="w-full flex flex-col  px-[5rem]">
      <h1 className="text-6xl my-10 font-bold uppercase text-start">
        Barangay Profile
      </h1>

      <div className="w-full flex flex-col items-center justify-center">
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
