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
import UpdateResident from './manage-resident/UpdateResident';
import DefaultProfile from '@/assets/default.jpg';
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
};

export default function ManageResident() {
  const [showAddResident, setShowAddResident] = useState<boolean>(false);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchResident, setSearchResident] = useState('');
  // const [residentSpecific, setResidentSpecific] = useState<Resident[]>([]);
  const [residentID, setResidentID] = useState<number>(0);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

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

  const handleShowUpdateForm = (id: number) => {
    // axios
    //   .get(`${import.meta.env.VITE_PROFILING}/resident.php`, {
    //     params: {
    //       product_id: id,
    //     },
    //   })
    //   .then((res) => {
    //     setResidentSpecific(res.data);
    //     console.log(res.data, 'spe prorduct');
    //   });

    setShowUpdateForm(true);
    setResidentID(id);
  };

  return (
    <div className=" w-full h-full relative">
      <h1>Manage Resident</h1>

      <div className="w-[100%] flex justify-center items-center border-2 mt-[2rem]">
        <div className="w-[80%] mt-[5rem] flex flex-col">
          <div className="w-full flex justify-between my-2">
            <Button onClick={() => setShowAddResident(!showAddResident)}>
              New Resident
            </Button>
            <div className="flex gap-2 ">
              <Button>Export</Button>

              <Input
                onChange={(e) => setSearchResident(e.target.value)}
                className="w-[18rem] "
                placeholder="Search"
              />
            </div>
          </div>
          <Table className="border-2">
            <TableHeader className="bg-violet-500 ">
              <TableRow>
                <TableHead className="text-white"></TableHead>

                <TableHead className="text-white">Fullname</TableHead>
                <TableHead className="text-white">Gender</TableHead>
                <TableHead className="text-white">Birthday</TableHead>
                <TableHead className="text-white">House No.</TableHead>
                <TableHead className="text-white">Purok/Zone</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residents
                .filter(
                  (resi) =>
                    resi.resident_lastname.includes(searchResident) ||
                    resi.resident_firstname.includes(searchResident) ||
                    resi.resident_middlename.includes(searchResident),
                )
                .map((resident, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        className="w-[5rem] h-[5rem] object-contain rounded-lg  mb-4"
                        src={
                          resident.resident_image!
                            ? resident.resident_image
                            : DefaultProfile
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {resident.resident_firstname +
                        ' ' +
                        resident.resident_middlename +
                        ' ' +
                        resident.resident_lastname}
                    </TableCell>
                    <TableCell>{resident.resident_gender}</TableCell>
                    <TableCell>{resident.resident_birthday}</TableCell>
                    <TableCell>{resident.resident_houseno}</TableCell>
                    <TableCell>{resident.resident_purok}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button>View</Button>
                        <Button
                          onClick={() =>
                            handleShowUpdateForm(resident.resident_id)
                          }
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
      {showAddResident && (
        <AddResident setShowAddResident={setShowAddResident} />
      )}

      {showUpdateForm && (
        <UpdateResident
          residentID={residentID}
          setShowUpdateForm={setShowUpdateForm}
        />
      )}
    </div>
  );
}
