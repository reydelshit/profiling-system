import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import DefaultProfile from '@/assets/default.jpg';

export default function AddHousehold({
  setShowAddHousehold,
}: {
  setShowAddHousehold: (value: boolean) => void;
}) {
  const [residentDemogprahy, setResidentDemogprahy] = useState({
    resident_firstname: '',
    resident_middlename: '',
    resident_lastname: '',
    resident_extension: '',
    resident_birthday: '',
    resident_place_of_birth: '',
    resident_nationality: '',
    resident_religion: '',

    resident_weight: '',
    resident_height: '',
    resident_father_name: '',
    resident_mother_name: '',
    resident_houseno: '',
    resident_address: '',
  });
  const [purok, setPurok] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setResidentDemogprahy((values) => ({ ...values, [name]: value }));
  };

  const handleSubmitResidentDemo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');

    axios
      .post(`${import.meta.env.VITE_PROFILING}/resident.php`, {
        ...residentDemogprahy,
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
    <div className="absolute w-full bg-violet-50 bg-opacity-75 h-fit py-[5rem] flex justify-center z-30 top-0">
      <form
        className="bg-white border-2 h-full mt-[2rem] p-6 rounded-md w-[90%]"
        onSubmit={handleSubmitResidentDemo}
      >
        <div>
          Resedential Address
          <div>
            <Label>House No.</Label>
            <Input
              onChange={handleInputChange}
              name="resident_houseno"
              className="w-full"
              required
            />
          </div>
          <div className="w-full ">
            <Label>Purok/Zone</Label>

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
              onChange={handleInputChange}
              name="resident_address"
              className="w-full"
              required
            />
          </div>
        </div>

        <div className="mt-[2rem]">
          <Button onClick={() => setShowAddHousehold(false)}>Cancel</Button>

          <Button type="submit" className="ml-2">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
