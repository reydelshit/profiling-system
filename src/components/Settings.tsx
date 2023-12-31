import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Settings() {
  const [barangayCaptain, setBarangayCaptain] = useState<string>('');
  const [barangaySecretary, setBarangaySecretary] = useState<string>('');
  const [barangayTreasurer, setBarangayTreasurer] = useState<string>('');

  const [barangayOfficials, setBarangayOfficials] = useState<any[]>([]);

  const [barangayName, setBarangayName] = useState<string>('');
  const [barangayAddress, setBarangayAddress] = useState<string>('');

  const fetchBarangayOfficials = () => {
    axios.get(`${import.meta.env.VITE_PROFILING}/officials.php`).then((res) => {
      console.log(res.data);
      setBarangayOfficials(res.data);

      if (res.data[0].official_type === 'Barangay Captain')
        setBarangayCaptain(res.data[0].official_name);
      if (res.data[1].official_type === 'Barangay Secretary')
        setBarangaySecretary(res.data[1].official_name);
      if (res.data[2].official_type === 'Barangay Treasurer')
        setBarangayTreasurer(res.data[2].official_name);
    });
  };

  const fetchBarangayDetails = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/barangaydetails.php`)
      .then((res) => {
        console.log(res.data);
        setBarangayName(res.data[0].barangay_name);
        setBarangayAddress(res.data[0].barangay_address);
      });
  };

  useEffect(() => {
    fetchBarangayOfficials();
    fetchBarangayDetails();
  }, []);

  const handleSubmitCaptain = () => {
    axios
      .post(`${import.meta.env.VITE_PROFILING}/officials.php`, {
        official_type: 'Barangay Captain',
        official_name: barangayCaptain,
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
