import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

export default function UpdateHousehold({
  setShowUpdateForm,
  householdId,
}: {
  householdId: number;
  setShowUpdateForm: (value: boolean) => void;
}) {
  const [purok, setPurok] = useState<string>('');
  const [houseNo, setHouseNo] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const fetchHousehold = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/household.php`, {
        params: { house_id: householdId },
      })
      .then((res) => {
        console.log(res.data);
        setHouseNo(res.data[0].house_no);
        setPurok(res.data[0].house_purok);
        setAddress(res.data[0].house_address);

        console.log(res.data[0].house_purok);
      });
  };

  useEffect(() => {
    fetchHousehold();
  }, []);

  const handleSubmitResidentDemo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');

    axios
      .put(`${import.meta.env.VITE_PROFILING}/household.php`, {
        house_id: householdId,
        house_no: houseNo,
        house_purok: purok,
        house_address: address,
      })
      .then((res: any) => {
        console.log(res.data);
      });

    window.location.reload();
  };

  const handlePurok = (event: string) => {
    const selectedValue = event;
    console.log(selectedValue);
    setPurok(selectedValue);
  };

  return (
    <div className="absolute w-full bg-white bg-opacity-75 h-screen py-[5rem] flex justify-center z-30 top-0">
      <form
        className="bg-white border-2 h-fit mt-[2rem] p-6 rounded-md w-[40%]"
        onSubmit={handleSubmitResidentDemo}
      >
        <div>
          Resedential Address
          <div>
            <Label>House No.</Label>
            <Input
              defaultValue={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              name="resident_houseno"
              className="w-full"
              required
            />
          </div>
          <div className="w-full ">
            <Label>Purok/Zone (current: {purok})</Label>

            <Select onValueChange={handlePurok}>
              <SelectTrigger>
                <SelectValue placeholder="Purok" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Full Address</Label>
            <Input
              defaultValue={address}
              onChange={(e) => setAddress(e.target.value)}
              name="resident_address"
              className="w-full"
              required
            />
          </div>
        </div>

        <div className="mt-[2rem]">
          <Button onClick={() => setShowUpdateForm(false)}>Cancel</Button>

          <Button type="submit" className="ml-2">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
