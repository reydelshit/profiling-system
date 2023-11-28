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
import UpdateHousehold from './manage-household/UpdateHousehold';

type Household = {
  house_id: number;
  house_no: string;
  house_purok: string;
  house_address: string;
};

export default function ManageHousehold() {
  const [household, setHousehold] = useState<Household[]>([]);
  const [showAddHousehold, setShowAddHousehold] = useState<boolean>(false);
  const [searchHousehold, setSearchHousehold] = useState<string>('');
  const [householdId, setHouseholdId] = useState<number>(0);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  const fetchHousehold = async () => {
    axios.get(`${import.meta.env.VITE_PROFILING}/household.php`).then((res) => {
      console.log(res.data);
      setHousehold(res.data);
    });
  };

  useEffect(() => {
    fetchHousehold();
  }, []);

  const handleDeleteHousehold = (id: number) => {
    console.log(id);
    axios
      .delete(`${import.meta.env.VITE_PROFILING}/household.php`, {
        data: { house_id: id },
      })
      .then((res) => {
        console.log(res.data);
        fetchHousehold();
      });
  };

  const handleShowUpdateForm = (id: number) => {
    setHouseholdId(id);
    setShowUpdateForm(true);

    console.log(id);
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
              {household
                .filter((house) => house.house_no.includes(searchHousehold))
                .map((house, index) => (
                  <TableRow className="text-center" key={index}>
                    <TableCell>{house.house_id}</TableCell>
                    <TableCell>{house.house_no}</TableCell>
                    <TableCell>{house.house_purok}</TableCell>

                    <TableCell className="flex justify-center">
                      <div className="flex gap-2">
                        <Button>View</Button>
                        <Button
                          onClick={() => handleShowUpdateForm(house.house_id)}
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => handleDeleteHousehold(house.house_id)}
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

      {showUpdateForm && (
        <UpdateHousehold
          setShowUpdateForm={setShowUpdateForm}
          householdId={householdId}
        />
      )}
    </div>
  );
}
