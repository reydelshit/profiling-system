import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Label } from './ui/label';
import { Resident } from '@/entities/types';

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
    <div className="px-[5rem]">
      <h1 className="text-4xl my-10">MANAGE RESIDENT VIEW</h1>

      <div>
        {resident.length > 0 &&
          resident.map((resident, index) => {
            return (
              <div key={index} className="flex flex-col">
                <h1 className="font-bold">Resident Demography</h1>

                <div className="flex gap-2 p-2">
                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Firstname</Label>
                    <h1 className="font-semibold">
                      {resident.resident_firstname}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Middlename</Label>
                    <h1 className="font-semibold">
                      {resident.resident_middlename}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Lastname</Label>
                    <h1 className="font-semibold">
                      {resident.resident_lastname}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Extension</Label>
                    <h1 className="font-semibold">
                      {resident.resident_extension}
                    </h1>
                  </span>
                </div>

                <div className="flex gap-2 p-2">
                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Date of Birth</Label>
                    <h1 className="font-semibold">
                      {resident.resident_birthday}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Place of Birth</Label>
                    <h1 className="font-semibold">
                      {resident.resident_place_of_birth}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Nationality</Label>
                    <h1 className="font-semibold">
                      {resident.resident_nationality}
                    </h1>
                  </span>
                </div>

                <div className="flex gap-2 p-2">
                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Gender</Label>
                    <h1 className="font-semibold">
                      {resident.resident_gender}
                    </h1>
                  </span>
                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Religion</Label>
                    <h1 className="font-semibold">
                      {resident.resident_religion}
                    </h1>
                  </span>
                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Type (pwd or deceased)</Label>
                    <h1 className="font-semibold">{resident.resident_type}</h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Civil Status</Label>
                    <h1 className="font-semibold">
                      {resident.resident_civilstatus}
                    </h1>
                  </span>
                </div>

                <div className="flex gap-2 p-2">
                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Weight</Label>
                    <h1 className="font-semibold">
                      {resident.resident_weight}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Height</Label>
                    <h1 className="font-semibold">
                      {resident.resident_height}
                    </h1>
                  </span>
                </div>

                <div className="flex gap-2 p-2">
                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Father's Name</Label>
                    <h1 className="font-semibold">
                      {resident.resident_father_name}
                    </h1>
                  </span>

                  <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                    <Label>Mother's Name</Label>
                    <h1 className="font-semibold">
                      {resident.resident_mother_name}
                    </h1>
                  </span>
                </div>

                <div className="p-2">
                  <h1 className="font-bold">Resedential Address</h1>

                  <div className="flex gap-2 p-2">
                    <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                      <Label>Houseno</Label>
                      <h1 className="font-semibold">
                        {resident.resident_houseno}
                      </h1>
                    </span>

                    <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
                      <Label>Purok</Label>
                      <h1 className="font-semibold">
                        {resident.resident_purok}
                      </h1>
                    </span>

                    <span className="block w-full border-2 p-2 rounded-md bg-[#1A4D2E] text-white">
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
