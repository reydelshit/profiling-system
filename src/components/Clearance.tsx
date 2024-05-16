import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClearanceType } from '@/entities/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import moment from 'moment';

export default function Clearance() {
  const [searchClearance, setSearchClearance] = useState<string>('');
  const [clearance, setClearance] = useState<ClearanceType[]>([]);

  const user_id = localStorage.getItem('profiling_token') as string;

  const fetchClearance = () => {
    console.log(user_id, 'user_id');
    axios
      .get(`${import.meta.env.VITE_PROFILING}/clearance.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data, 'ssssss');
        setClearance(res.data);
      });
  };

  useEffect(() => {
    fetchClearance();
  }, []);

  const handleDeleteClearance = (id: number) => {
    console.log(id);
    axios
      .delete(`${import.meta.env.VITE_PROFILING}/clearance.php`, {
        data: { clearance_id: id },
      })
      .then((res) => {
        console.log(res.data);
        fetchClearance();
      });
  };

  return (
    <div className="px-[5rem]">
      <h1 className="text-4xl my-10">CLEARANCE</h1>

      <div id="household-table">
        <Input
          className="my-2 w-[20rem]"
          placeholder="Search"
          onChange={(e) => setSearchClearance(e.target.value)}
        />
        <Table className="border-2">
          <TableHeader className="bg-[#1A4D2E]  ">
            <TableRow>
              <TableHead className="text-white text-center">Name</TableHead>
              <TableHead className="text-white text-center">Address</TableHead>
              <TableHead className="text-white text-center">Birthday</TableHead>
              <TableHead className="text-white text-center">Purpose</TableHead>
              <TableHead className="text-white text-center">
                Issued On
              </TableHead>
              <TableHead className="text-white text-center">
                Valid Until
              </TableHead>
              <TableHead className="text-white text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clearance
              .filter((clearance) =>
                clearance.resident_name.includes(searchClearance),
              )
              .map((clearance, index) => (
                <TableRow className="text-center" key={index}>
                  <TableCell>{clearance.resident_name}</TableCell>
                  <TableCell>{clearance.resident_address}</TableCell>
                  <TableCell>
                    {' '}
                    {moment(clearance.resident_birthday).format('LL')}
                  </TableCell>
                  <TableCell>{clearance.resident_purpose}</TableCell>
                  <TableCell>
                    {moment(clearance.resident_issued).format('LL')}
                  </TableCell>
                  <TableCell>
                    {' '}
                    {moment(clearance.resident_until).format('LL')}
                  </TableCell>

                  <TableCell className="flex justify-center">
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleDeleteClearance(clearance.clearance_id)
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
  );
}
