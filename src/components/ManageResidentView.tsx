import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Label } from './ui/label';
import { useEffect } from 'react';

type Resident = {
  resident_id: number;

  resident_firstname: string;
  resident_middlename: string;
  resident_lastname: string;
  resident_extension: string;
  resident_birthday: string;
  resident_place_of_birth: string;
  resident_nationality: string;
  resident_religion: string;
  resident_weight: string;
  resident_height: string;
  resident_father_name: string;
  resident_mother_name: string;
  resident_houseno: string;

  resident_gender: string;
  resident_image: string;
  resident_type: string;
  resident_civilstatus: string;
  resident_purok: string;
  resident_address: string;
};

export default function ManageResidentView() {
  const { id } = useParams();
  const [resident, setResident] = useState<Resident[]>([]);

  const getResident = async () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/resident.php`, {
        params: { resident_id: id },
      })
      .then((res) => {
        setResident(res.data);

        console.log(res.data);
      });
  };

  useEffect(() => {
    getResident();
  }, []);

  return (
    <div>
      <h1 className="text-4xl my-10">MANAGE RESIDENT VIEW</h1>

      <div>
        {resident.length > 0 &&
          resident.map((resident, index) => {
            return (
              <div key={index} className="flex flex-col">
                <h1 className="font-bold">Resident Demography</h1>

                <div className="flex gap-2 p-2">
                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Firstname</Label>
                    <h1 className="font-semibold">
                      {resident.resident_firstname}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Middlename</Label>
                    <h1 className="font-semibold">
                      {resident.resident_middlename}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Lastname</Label>
                    <h1 className="font-semibold">
                      {resident.resident_lastname}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Extension</Label>
                    <h1 className="font-semibold">
                      {resident.resident_extension}
                    </h1>
                  </span>
                </div>

                <div className="flex gap-2 p-2">
                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Date of Birth</Label>
                    <h1 className="font-semibold">
                      {resident.resident_birthday}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Place of Birth</Label>
                    <h1 className="font-semibold">
                      {resident.resident_place_of_birth}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Nationality</Label>
                    <h1 className="font-semibold">
                      {resident.resident_nationality}
                    </h1>
                  </span>
                </div>

                <div className="flex gap-2 p-2">
                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Gender</Label>
                    <h1 className="font-semibold">
                      {resident.resident_gender}
                    </h1>
                  </span>
                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Religion</Label>
                    <h1 className="font-semibold">
                      {resident.resident_religion}
                    </h1>
                  </span>
                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Type (pwd or deceased)</Label>
                    <h1 className="font-semibold">{resident.resident_type}</h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Civil Status</Label>
                    <h1 className="font-semibold">
                      {resident.resident_civilstatus}
                    </h1>
                  </span>
                </div>

                <div className="flex gap-2 p-2">
                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Weight</Label>
                    <h1 className="font-semibold">
                      {resident.resident_weight}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Height</Label>
                    <h1 className="font-semibold">
                      {resident.resident_height}
                    </h1>
                  </span>
                </div>

                <div className="flex gap-2 p-2">
                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Father's Name</Label>
                    <h1 className="font-semibold">
                      {resident.resident_father_name}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md">
                    <Label>Mother's Name</Label>
                    <h1 className="font-semibold">
                      {resident.resident_mother_name}
                    </h1>
                  </span>
                </div>

                <div className="p-2">
                  <h1 className="font-bold">Resedential Address</h1>

                  <div className="flex gap-2 p-2">
                    <span className="block w-full border-2 p-2 rounded-md">
                      <Label>Houseno</Label>
                      <h1 className="font-semibold">
                        {resident.resident_houseno}
                      </h1>
                    </span>

                    <span className="block w-full border-2 p-2 rounded-md">
                      <Label>Purok</Label>
                      <h1 className="font-semibold">
                        {resident.resident_purok}
                      </h1>
                    </span>

                    <span className="block w-full border-2 p-2 rounded-md">
                      <Label>Address</Label>
                      <h1 className="font-semibold">
                        {resident.resident_address}
                      </h1>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
