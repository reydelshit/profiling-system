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
import { useToast } from '../ui/use-toast';
import moment from 'moment';
import useLog from '../useLog';

type Household = {
  house_id: number;
  house_no: string;
  house_purok: string;
  house_address: string;
};

export default function AddResident({
  setShowAddResident,
  user_id,
  fetchResidents,
}: {
  setShowAddResident: (value: boolean) => void;
  user_id: string;
  fetchResidents: () => void;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [residentGender, setResidentGender] = useState<string>('');
  const [civilStatus, setCivilStatus] = useState<string>('');
  const [purok, setPurok] = useState<string>('');
  const [householdName, setHouseholdName] = useState<string>('');
  const [residentType, setResidentType] = useState<string>('');
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
  const [fullAddress, setFullAddress] = useState<string>('');
  const [defaultPurok, setDefaultPurok] = useState<number | null>(null);

  const [household, setHousehold] = useState<Household[]>([]);
  const { toast } = useToast();
  const fetchHousehold = async () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/household.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data);
        setHousehold(res.data);
      });
  };

  useEffect(() => {
    fetchHousehold();
  }, []);

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
        resident_gender: residentGender,
        resident_image: image,
        resident_type: residentType,
        resident_civilstatus: civilStatus,
        resident_address:
          residentDemogprahy.resident_address.length > 0
            ? residentDemogprahy.resident_address
            : fullAddress,
        resident_purok: defaultPurok != null ? defaultPurok : purok,
        resident_houseno: householdName,
        user_id: user_id,
      })
      .then((res: any) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          toast({
            style: { background: '#1A4D2E', color: 'white' },
            title: 'Resident Added Successfully 🎉',
            description: moment().format('LLLL'),
          });
          setShowAddResident(false);
          fetchResidents();

          useLog(`You have added resident `, 'Add').handleUploadActivityLog();
        }
      });

    // window.location.reload();
  };

  const handleResidentGenderChange = (event: string) => {
    const selectedValue = event;
    setResidentGender(selectedValue);
    // console.log(selectedValue);
  };

  const handleCivilStatus = (event: string) => {
    const selectedValue = event;
    console.log(selectedValue);
    setCivilStatus(selectedValue);
  };

  const handlePurok = (event: string) => {
    const selectedValue = event;
    console.log(selectedValue);
    setPurok(selectedValue);
  };

  // resident_houseno
  const handleChangeHousehold = (event: string) => {
    const selectedValue = event;

    const houseno = selectedValue.split('-')[0];

    console.log(houseno);
    setHouseholdName(houseno);

    const address = selectedValue.split('-')[1].split('/')[0];

    setFullAddress(address);

    // set default purok
    const purok = selectedValue.split('/')[1];
    setDefaultPurok(parseInt(purok));
  };

  const handleResidentType = (event: string) => {
    const selectedValue = event;
    console.log(selectedValue);
    setResidentType(selectedValue);
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setImage(base64.toString());
      }
    };
  };

  return (
    <div className="absolute w-full bg-violet-50 bg-opacity-75 h-fit py-[5rem] flex justify-center z-30 left-0 top-[-5rem] border-2">
      <form
        className="bg-white border-2 h-full p-6 rounded-md w-[80%] flex gap-4"
        onSubmit={handleSubmitResidentDemo}
      >
        <div className="w-[50%]">
          <div className="flex flex-col gap-2">
            <div className="mb-2">
              <img
                className="w-full h-[20rem] object-contain rounded-lg  mb-4"
                src={image! ? image! : DefaultProfile}
              />
              <Label>Resident Image</Label>
              <Input
                required
                type="file"
                accept="image/*"
                onChange={handleChangeImage}
                name="resident_image"
              />
            </div>
            <div className="w-full">
              <Label>First name</Label>
              <Input
                type="text"
                onChange={handleInputChange}
                name="resident_firstname"
                className="w-full"
                required
              />
            </div>

            <div className="w-full">
              <Label>Middle name</Label>
              <Input
                onChange={handleInputChange}
                name="resident_middlename"
                className="w-full"
                required
              />
            </div>

            <div className="w-full">
              <Label>Last name</Label>
              <Input
                onChange={handleInputChange}
                name="resident_lastname"
                className="w-full"
                required
              />
            </div>

            <div className="w-full">
              <Label>Extension</Label>
              <Input
                onChange={handleInputChange}
                name="resident_extension"
                className="w-full"
                required
              />
            </div>
          </div>
          <div className="w-full">
            <Label>Birthday</Label>
            <Input
              onChange={handleInputChange}
              name="resident_birthday"
              type="date"
              className="w-full"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Place of Birth</Label>
              <Input
                onChange={handleInputChange}
                name="resident_place_of_birth"
                className="w-full"
                required
              />
            </div>

            <div className="w-full">
              <Label>Nationality</Label>
              <Input
                onChange={handleInputChange}
                name="resident_nationality"
                className="w-full"
                required
              />
            </div>

            <div className="w-full">
              <Label>Religion</Label>
              <Input
                onChange={handleInputChange}
                name="resident_religion"
                className="w-full"
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-full ">
              <Label>Gender</Label>

              <Select onValueChange={handleResidentGenderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full ">
              <Label>Type</Label>

              <Select onValueChange={handleResidentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N/A">N/A</SelectItem>
                  <SelectItem value="PWD">PWD</SelectItem>
                  <SelectItem value="Deceased">Deceased</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="h-dvh flex-col flex w-[50%] justify-end pb-[4.5rem]">
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Weight.(55kg)</Label>
              <Input
                onChange={handleInputChange}
                name="resident_weight"
                className="w-full"
                required
              />
            </div>

            <div className="w-full">
              <Label>Height (5'5ft)</Label>
              <Input
                onChange={handleInputChange}
                name="resident_height"
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="w-full ">
            <Label>Civil Status</Label>

            <Select onValueChange={handleCivilStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Civil Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Seperated or Divorced">
                  Seperated or Divorced
                </SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label>Father's Name</Label>
              <Input
                onChange={handleInputChange}
                name="resident_father_name"
                className="w-full"
                required
              />
            </div>

            <div className="w-full">
              <Label>Mother's Name </Label>
              <Input
                onChange={handleInputChange}
                name="resident_mother_name"
                className="w-full"
                required
              />
            </div>
          </div>

          <div>
            Resedential Address
            <div>
              <Label>House No.</Label>

              <Select onValueChange={handleChangeHousehold}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Household" />
                </SelectTrigger>
                <SelectContent>
                  {household.map((house, index) => (
                    <SelectItem
                      key={index}
                      value={
                        house.house_no +
                        '-' +
                        house.house_address +
                        '/' +
                        house.house_purok
                      }
                    >
                      {house.house_no}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full ">
              <Label>Purok/Zone</Label>

              <Select value={String(defaultPurok)} onValueChange={handlePurok}>
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
                value={fullAddress}
                readOnly
                required
              />
            </div>
          </div>

          <div className="mt-[2rem]">
            <Button onClick={() => setShowAddResident(false)}>Cancel</Button>

            <Button type="submit" className="ml-2">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
