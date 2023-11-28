import AddResident from './manage-resident/AddResident';
import { Button } from './ui/button';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { useEffect } from 'react';
import { Input } from './ui/input';

import moment from 'moment';
import AddHousehold from './manage-household/AddHousehold';

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

export default function ManageHousehold() {
  const [houseNo, setHouseNo] = useState<string>('');
  const [purok, setPurok] = useState<string>('');
  const [defaultDate] = useState(moment().format('YYYY-MM-DD'));
  const [residents, setResidents] = useState<Resident[]>([]);
  const [showAddHousehold, setShowAddHousehold] = useState<boolean>(false);
  const [residentSpecific, setResidentSpecific] = useState<Resident[]>([]);
  const [searchHousehold, setSearchHousehold] = useState<string>('');

  const fetchResidents = async () => {
    axios.get(`${import.meta.env.VITE_PROFILING}/resident.php`).then((res) => {
      console.log(res.data);
      setResidents(res.data);
    });
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleDeleteResident = (id: number) => {
    console.log(id);
    axios
      .delete(`${import.meta.env.VITE_PROFILING}/resident.php`, {
        data: { resident_id: id },
      })
      .then((res) => {
        console.log(res.data);
        fetchResidents();
      });
  };

  return (
    <div className="w-full h-full relative">
      <h1>Manage household</h1>

      <div className="w-[100%] flex justify-center items-center border-2 mt-[2rem]">
        <div className="w-[80%] mt-[5rem] flex flex-col">
          <div className="w-full flex justify-between my-2">
            <Button onClick={() => setShowAddHousehold(!showAddHousehold)}>
              New Household
            </Button>
            <div className="flex gap-2 ">
              <Button>Export</Button>

              <Input
                onChange={(e) => setSearchHousehold(e.target.value)}
                className="w-[18rem] "
                placeholder="Search"
              />
            </div>
          </div>
          <Table className="border-2">
            <TableHeader className="bg-violet-500 ">
              <TableRow>
                <TableHead className="text-white text-center">
                  Household ID No.
                </TableHead>
                <TableHead className="text-white text-center">
                  House No.
                </TableHead>
                <TableHead className="text-white text-center">Purok</TableHead>
                <TableHead className="text-white text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residents
                .filter(
                  (resi) =>
                    resi.resident_lastname.includes(searchHousehold) ||
                    resi.resident_firstname.includes(searchHousehold) ||
                    resi.resident_middlename.includes(searchHousehold),
                )
                .map((resident, index) => (
                  <TableRow className="text-center" key={index}>
                    <TableCell>{resident.resident_gender}</TableCell>
                    <TableCell>{resident.resident_birthday}</TableCell>
                    <TableCell>{resident.resident_birthday}</TableCell>

                    <TableCell className="flex justify-center">
                      <div className="flex gap-2">
                        <Button>View</Button>
                        <Button
                        // onClick={() =>
                        //   handleShowUpdateForm(resident.resident_id)
                        // }
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() =>
                            handleDeleteResident(resident.resident_id)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {showAddHousehold && (
        <AddHousehold setShowAddHousehold={setShowAddHousehold} />
      )}
    </div>
  );
}
