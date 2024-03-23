import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import CryptoJS from 'crypto-js';

import AddHousehold from './manage-household/AddHousehold';
import UpdateHousehold from './manage-household/UpdateHousehold';
import { useNavigate } from 'react-router-dom';
type Household = {
  house_id: number;
  house_no: string;
  house_purok: string;
  house_address: string;
  resident_count: string;
};

export default function ManageHousehold() {
  const [household, setHousehold] = useState<Household[]>([]);
  const [showAddHousehold, setShowAddHousehold] = useState<boolean>(false);
  const [searchHousehold, setSearchHousehold] = useState<string>('');
  const [householdId, setHouseholdId] = useState<number>(0);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  const secretKey = 'your_secret_key';
  const [user_id, setUserId] = useState<string>('');
  const navigate = useNavigate();

  const decrypt = () => {
    const user_id = localStorage.getItem('profiling_token') as string;
    const bytes = CryptoJS.AES.decrypt(user_id.toString(), secretKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    console.log(plaintext);
    setUserId(plaintext);
    fetchHousehold(plaintext);
  };

  const fetchHousehold = async (user_id: string) => {
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
    decrypt();
  }, []);

  const handleDeleteHousehold = (id: number) => {
    const reauthToken = localStorage.getItem('profiling_reauth');

    if (reauthToken === '0') {
      navigate('/login', { replace: true });

      // console.log(id);
      // axios
      //   .delete(`${import.meta.env.VITE_PROFILING}/household.php`, {
      //     data: { house_id: id },
      //   })
      //   .then((res) => {
      //     console.log(res.data);
      //     decrypt();
      //   });

      localStorage.setItem('profiling_reauth', '1');
    }
  };

  const handleShowUpdateForm = (id: number) => {
    setHouseholdId(id);
    setShowUpdateForm(true);

    console.log(id);
  };

  const handleTable = () => {
    const printContents = document.getElementById('household-table')?.innerHTML;
    const originalContents = document.body.innerHTML;

    const printWindow = window.open('', '_blank');

    if (printWindow) {
      if (printContents && typeof printContents === 'string') {
        printWindow.document.body.innerHTML = printContents;
      }

      printWindow.print();
      printWindow.close();
      document.body.innerHTML = originalContents;
    }
  };

  return (
    <div className="w-full h-full relative px-[5rem]">
      <h1 className="text-4xl my-10">MANAGE HOUSEHOLD</h1>

      <div className="w-[100%] flex justify-center items-center mt-[2rem]">
        <div className="w-[90%] mt-[5rem] flex flex-col">
          <div className="w-full flex justify-between my-2">
            <Button onClick={() => setShowAddHousehold(!showAddHousehold)}>
              New Household
            </Button>
            <div className="flex gap-2 ">
              <Button onClick={handleTable}>Export</Button>

              <Input
                onChange={(e) => setSearchHousehold(e.target.value)}
                className="w-[18rem] "
                placeholder="Search"
              />
            </div>
          </div>
          <div id="household-table">
            <Table className="border-2">
              <TableHeader className="bg-pink-500 ">
                <TableRow>
                  <TableHead className="text-white text-center">
                    Number of Person in Household
                  </TableHead>
                  <TableHead className="text-white text-center">
                    House No.
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Purok
                  </TableHead>

                  <TableHead className="text-white text-center">
                    Full Address
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {household.length > 0 ? (
                  household &&
                  household
                    .filter((house) => house.house_no.includes(searchHousehold))
                    .map((house, index) => (
                      <TableRow className="text-center" key={index}>
                        <TableCell>{house.resident_count}</TableCell>
                        <TableCell>{house.house_no}</TableCell>
                        <TableCell>{house.house_purok}</TableCell>
                        <TableCell>{house.house_address}</TableCell>

                        <TableCell className="flex justify-center">
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleShowUpdateForm(house.house_id)
                              }
                            >
                              Update
                            </Button>
                            <Button
                              onClick={() =>
                                handleDeleteHousehold(house.house_id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>Household Empty </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {showAddHousehold && (
        <AddHousehold
          user_id={user_id}
          setShowAddHousehold={setShowAddHousehold}
        />
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
