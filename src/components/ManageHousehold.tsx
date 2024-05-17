import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Household } from '@/entities/types';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import VerifyPassword from './VerifyPassword';
import AddHousehold from './manage-household/AddHousehold';
import UpdateHousehold from './manage-household/UpdateHousehold';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import moment from 'moment';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import useLog from './useLog';

export default function ManageHousehold() {
  const [household, setHousehold] = useState<Household[]>([]);
  const [showAddHousehold, setShowAddHousehold] = useState<boolean>(false);
  const [searchHousehold, setSearchHousehold] = useState<string>('');
  const [householdId, setHouseholdId] = useState<number>(0);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showReauth, setShowReauth] = useState<boolean>(false);
  const [storeDeleteID, setStoreDeleteID] = useState<number>(0);

  const user_id = localStorage.getItem('profiling_token') as string;

  const { toast } = useToast();
  const fetchHousehold = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/household.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data, 'house');
        setHousehold(res.data);
      });
  };

  useEffect(() => {
    fetchHousehold();
  }, []);

  const handleDeleteHousehold = (id: number) => {
    const reauthToken = localStorage.getItem('profiling_reauth') as string;

    console.log(id);

    if (reauthToken === '0') {
      setShowReauth(true);
      setStoreDeleteID(id);
    } else {
      axios
        .delete(`${import.meta.env.VITE_PROFILING}/household.php`, {
          data: { house_id: id },
        })

        .then((res) => {
          console.log(res.data);
          toast({
            style: { background: '#1A4D2E', color: 'white' },
            title: 'Deleted Household Successfully 🎉',
            description: moment().format('LLLL'),
          });

          fetchHousehold();

          useLog(
            `You have deleted resident with id ${id} `,
            'Delete',
          ).handleUploadActivityLog();
        });
    }
  };

  const handleShowUpdateForm = (id: number) => {
    setHouseholdId(id);
    setShowUpdateForm(true);

    console.log(id);
  };

  const componentRef = useRef<HTMLTableElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current || null,
  });

  return (
    <div className="w-full h-full relative px-[5rem]">
      <h1 className="text-6xl my-10 font-bold">MANAGE HOUSEHOLD</h1>

      <div className="w-[100%] flex justify-center items-center mt-[2rem]">
        <div className="w-[90%] mt-[5rem] flex flex-col">
          <div className="w-full flex justify-between my-2">
            <Button onClick={() => setShowAddHousehold(!showAddHousehold)}>
              New Household
            </Button>
            <div className="flex gap-2 ">
              <Button onClick={handlePrint}>Export</Button>

              <Input
                onChange={(e) => setSearchHousehold(e.target.value)}
                className="w-[18rem] "
                placeholder="Search"
              />
            </div>
          </div>
          <div>
            <Table ref={componentRef} className="border-2">
              <TableHeader className="bg-[#1A4D2E] ">
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
                  <TableHead className="text-white text-center no-print">
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

                        <TableCell className="flex justify-center no-print">
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleShowUpdateForm(house.house_id)
                              }
                            >
                              Update
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Button>Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete and remove the data from
                                    our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction>
                                    <Button
                                      onClick={() =>
                                        handleDeleteHousehold(house.house_id)
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
          fetchHousehold={fetchHousehold}
        />
      )}

      {showUpdateForm && (
        <UpdateHousehold
          setShowUpdateForm={setShowUpdateForm}
          householdId={householdId}
          fetchHousehold={fetchHousehold}
        />
      )}

      {showReauth && (
        <VerifyPassword
          phpFile="household"
          deleteIDColumn="house_id"
          storeDeleteID={storeDeleteID}
          setShowReauth={setShowReauth}
          funcFunction={fetchHousehold}
        />
      )}
    </div>
  );
}
