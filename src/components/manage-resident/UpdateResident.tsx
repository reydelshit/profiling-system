import DefaultProfile from '@/assets/default.jpg';
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
import { useToast } from '../ui/use-toast';
import moment from 'moment';
import useLog from '../useLog';

export default function UpdateResident({
  setShowUpdateForm,
  residentID,
  fetchResidents,
}: {
  residentID: number;
  setShowUpdateForm: (value: boolean) => void;
  fetchResidents: () => void;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [residentGender, setResidentGender] = useState<string>('');
  const [civilStatus, setCivilStatus] = useState<string>('');
  const [purok, setPurok] = useState<string>('');
  const [residentType, setResidentType] = useState<string>('');
  //   const [residentSpecific, setResidentSpecific] = useState<Resident >({});
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

    resident_gender: '',
    resident_type: '',
    resident_civilstatus: '',
    resident_purok: '',
    resident_address: '',
  });

  const { toast } = useToast();
  const fetchResident = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/resident.php`, {
        params: { resident_id: residentID },
      })
      .then((res) => {
        console.log(res.data);
        setResidentDemogprahy(res.data[0]);
        setImage(res.data[0].resident_image);
      });
  };

  useEffect(() => {
    fetchResident();
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
      .put(`${import.meta.env.VITE_PROFILING}/resident.php`, {
        ...residentDemogprahy,
        resident_gender:
          residentGender.length > 0
            ? residentGender
            : residentDemogprahy.resident_gender,
        resident_image: image,
        resident_type:
          residentType.length > 0
            ? residentType
            : residentDemogprahy.resident_type,
        resident_civilstatus:
          civilStatus.length > 0
            ? civilStatus
            : residentDemogprahy.resident_civilstatus,
        resident_purok:
          purok.length > 0 ? purok : residentDemogprahy.resident_purok,
        resident_id: residentID,
      })
      .then((res: any) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          toast({
            style: { background: '#1A4D2E', color: 'white' },
            title: 'Resident Updated Successfully 🎉',
            description: moment().format('LLLL'),
          });
          setShowUpdateForm(false);
          fetchResidents();

          useLog(
            `You have updated resident with id ${residentID} `,
            'Update',
          ).handleUploadActivityLog();
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
    <div className="absolute w-full bg-white bg-opacity-75 h-fit py-[5rem] flex justify-center z-30 top-0">
      <form
        className="bg-white border-2 h-full mt-[2rem] p-6 rounded-md w-[90%]"
        onSubmit={handleSubmitResidentDemo}
      >
        <div className="flex flex-col gap-2">
          <div className="mb-2">
            <img
              className="w-full h-[20rem] object-contain rounded-lg  mb-4"
              src={image! ? image : DefaultProfile}
            />
            <Label>Resident Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              name="resident_image"
            />
          </div>
          <div className="w-full">
            <Label>First name</Label>
            <Input
              defaultValue={residentDemogprahy.resident_firstname}
              type="text"
              onChange={handleInputChange}
              name="resident_firstname"
              className="w-full"
            />
          </div>

          <div className="w-full">
            <Label>Middle name</Label>
            <Input
              defaultValue={residentDemogprahy.resident_middlename}
              onChange={handleInputChange}
              name="resident_middlename"
              className="w-full"
            />
          </div>

          <div className="w-full">
            <Label>Last name</Label>
            <Input
              defaultValue={residentDemogprahy.resident_lastname}
              onChange={handleInputChange}
              name="resident_lastname"
              className="w-full"
            />
          </div>

          <div className="w-full">
            <Label>Extension</Label>
            <Input
              defaultValue={residentDemogprahy.resident_extension}
              onChange={handleInputChange}
              name="resident_extension"
              className="w-full"
            />
          </div>
        </div>
        <div className="w-full">
          <Label>Birthday</Label>
          <Input
            defaultValue={residentDemogprahy.resident_birthday}
            onChange={handleInputChange}
            name="resident_birthday"
            type="date"
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-full">
            <Label>Place of Birth</Label>
            <Input
              defaultValue={residentDemogprahy.resident_place_of_birth}
              onChange={handleInputChange}
              name="resident_place_of_birth"
              className="w-full"
            />
          </div>

          <div className="w-full">
            <Label>Nationality</Label>
            <Input
              defaultValue={residentDemogprahy.resident_nationality}
              onChange={handleInputChange}
              name="resident_nationality"
              className="w-full"
            />
          </div>

          <div className="w-full">
            <Label>Religion</Label>
            <Input
              defaultValue={residentDemogprahy.resident_religion}
              onChange={handleInputChange}
              name="resident_religion"
              className="w-full"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-full ">
            <Label>
              Gender (current: {residentDemogprahy.resident_gender})
            </Label>

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
            <Label>Type (current: {residentDemogprahy.resident_type})</Label>

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

        <div className="flex gap-4">
          <div className="w-full">
            <Label>Weight.(55kg)</Label>
            <Input
              defaultValue={residentDemogprahy.resident_weight}
              onChange={handleInputChange}
              name="resident_weight"
              className="w-full"
            />
          </div>

          <div className="w-full">
            <Label>Height (5'5ft)</Label>
            <Input
              defaultValue={residentDemogprahy.resident_height}
              onChange={handleInputChange}
              name="resident_height"
              className="w-full"
            />
          </div>
        </div>

        <div className="w-full ">
          <Label>
            Civil Status (current: {residentDemogprahy.resident_civilstatus})
          </Label>

          <Select onValueChange={handleCivilStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Civil Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Married">Married</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <div className="w-full">
            <Label>Father's Name</Label>
            <Input
              defaultValue={residentDemogprahy.resident_father_name}
              onChange={handleInputChange}
              name="resident_father_name"
              className="w-full"
            />
          </div>

          <div className="w-full">
            <Label>Mother's Name </Label>
            <Input
              defaultValue={residentDemogprahy.resident_mother_name}
              onChange={handleInputChange}
              name="resident_mother_name"
              className="w-full"
            />
          </div>
        </div>

        <div>
          Resedential Address
          <div>
            <Label>House No.</Label>
            <Input
              defaultValue={residentDemogprahy.resident_houseno}
              onChange={handleInputChange}
              name="resident_houseno"
              className="w-full"
            />
          </div>
          <div className="w-full ">
            <Label>
              Purok/Zone (current: {residentDemogprahy.resident_purok})
            </Label>

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
              defaultValue={residentDemogprahy.resident_address}
              onChange={handleInputChange}
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
