import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useState } from 'react';
import axios from 'axios';

export default function Settings() {
  const [barangayCaptain, setBarangayCaptain] = useState<string>('');
  const [barangaySecretary, setBarangaySecretary] = useState<string>('');
  const [barangayTreasurer, setBarangayTreasurer] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');

    axios
      .post(`${import.meta.env.VITE_PROFILING}/officials.php`, {
        barangay_captain: barangayCaptain,
        barangay_secretary: barangaySecretary,
        barangay_treasurer: barangayTreasurer,
      })
      .then((res: any) => {
        console.log(res.data);
      });

    window.location.reload();
  };
  return (
    <div className="w-full">
      <h1 className="text-4xl my-10">SETTINGS</h1>

      <div className="w-[40rem]">
        <h1 className="font-bold my-5">Barangay Officials</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <Label>Barangay Captain</Label>
            <Input onChange={(e) => setBarangayCaptain(e.target.value)} />
          </div>

          <div>
            <Label>Barangay Secretary</Label>
            <Input onChange={(e) => setBarangaySecretary(e.target.value)} />
          </div>

          <div>
            <Label>Barangay Treasurer</Label>
            <Input onChange={(e) => setBarangayTreasurer(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="my-2">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
