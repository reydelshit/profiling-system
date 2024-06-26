import DefaultProfile from '@/assets/default.jpg';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Textarea } from '@/components/ui/textarea';
import { Resident } from '@/entities/types';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import VerifyPassword from './VerifyPassword';
import AddResident from './manage-resident/AddResident';
import UpdateResident from './manage-resident/UpdateResident';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import useLog from './useLog';
export default function ManageResident() {
  const [showAddResident, setShowAddResident] = useState<boolean>(false);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchResident, setSearchResident] = useState('');
  const [residentID, setResidentID] = useState<number>(0);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showClearanceForm, setShowClearanceForm] = useState<boolean>(false);
  const [defaultDate] = useState(moment().format('YYYY-MM-DD'));

  const [residentSpecific, setResidentSpecific] = useState<Resident[]>([]);

  const [showReauth, setShowReauth] = useState<boolean>(false);
  const [storeDeleteID, setStoreDeleteID] = useState<number>(0);

  // clearance

  const [residentName, setResidentName] = useState<string>('');
  const [residentBirthday, setResidentBirthday] = useState<string>('');
  const [residentAddress, setResidentAddress] = useState<string>('');
  const [residentPurpose, setResidentPurpose] = useState<string>('');
  const [residentIssuedDate, setResidentIssuedDate] = useState<string>('');
  const [residentValidUntil, setResidentValidUntil] = useState<string>('');
  const user_id = localStorage.getItem('profiling_token') as string;

  const { toast } = useToast();
  const fetchResidents = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/resident.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data);
        setResidents(res.data);
      });
  };

  const fetchResidentSpecific = (id: number) => {
    console.log(id);
    axios
      .get(`${import.meta.env.VITE_PROFILING}/resident.php`, {
        params: { resident_id: id },
      })
      .then((res) => {
        console.log(res.data);
        setResidentSpecific(res.data[0]);

        setResidentName(
          res.data[0].resident_firstname +
            ' ' +
            res.data[0].resident_middlename +
            ' ' +
            res.data[0].resident_lastname,
        );

        setResidentBirthday(res.data[0].resident_birthday);

        setResidentAddress(res.data[0].resident_address);
      });
  };

  useEffect(() => {
    Promise.all([fetchResidents()]);
  }, []);

  const handleDeleteResident = (id: number) => {
    const reauthToken = localStorage.getItem('profiling_reauth') as string;

    console.log(id);

    if (reauthToken === '0') {
      setShowReauth(true);
      setStoreDeleteID(id);
    } else {
      axios
        .delete(`${import.meta.env.VITE_PROFILING}/resident.php`, {
          data: { resident_id: id },
        })
        .then((res) => {
          if (res.data.status === 'success') {
            toast({
              style: { background: '#1A4D2E', color: 'white' },
              title: 'Resident Deleted Successfully 🎉',
              description: moment().format('LLLL'),
            });
            setShowAddResident(false);
            fetchResidents();

            useLog(
              `You have deleted resident with id ${id}`,
              'Delete',
            ).handleUploadActivityLog();
          }
        });
    }
  };

  const handleShowUpdateForm = (id: number) => {
    setShowUpdateForm(true);
    setResidentID(id);
  };

  const handleShowClearanceForm = (id: number) => {
    setResidentID(id);
    setShowClearanceForm(true);
    fetchResidentSpecific(id);
  };

  const handleSubmitClearance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_PROFILING}/clearance.php`, {
        resident_id: residentID,
        resident_name: residentName,
        resident_birthday: residentBirthday,
        resident_address: residentAddress,
        resident_purpose: residentPurpose,
        resident_issued:
          residentIssuedDate.length > 0 ? residentIssuedDate : defaultDate,
        resident_until: residentValidUntil,
        user_id: user_id,
      })
      .then((res) => {
        console.log(res.data);
        setShowClearanceForm(false);
        toast({
          style: { background: '#1A4D2E', color: 'white' },
          title: 'Clearance Submitted Successfully 🎉',
          description: moment().format('LLLL'),
        });
      });
  };

  const componentRef = useRef<HTMLTableElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current || null,
  });

  return (
    <div className="w-full h-dvh relative px-[5rem]">
      <h1 className="text-6xl my-10 font-bold">MANAGE RESIDENT</h1>

      <div className="w-[100%] flex justify-center items-center mt-[2rem]">
        <div className="w-[90%] mt-[5rem] flex flex-col">
          <div className="w-full flex justify-between my-2">
            <div className="flex gap-2">
              <Button onClick={() => setShowAddResident(!showAddResident)}>
                New Resident
              </Button>

              <Link to="/manage-resident/clearance/">
                <Button>Clearance</Button>
              </Link>
            </div>

            <div className="flex gap-2 ">
              <Button onClick={handlePrint}>Export</Button>

              <Input
                onChange={(e) => setSearchResident(e.target.value)}
                className="w-[18rem] "
                placeholder="Search"
              />
            </div>
          </div>
          <Table ref={componentRef} className="border-2">
            <TableHeader className="bg-[#1A4D2E] ">
              <TableRow>
                <TableHead className="text-white"></TableHead>

                <TableHead className="text-white">Fullname</TableHead>
                <TableHead className="text-white">Gender</TableHead>
                <TableHead className="text-white">Birthday</TableHead>
                <TableHead className="text-white">House No.</TableHead>
                <TableHead className="text-white">Purok/Zone</TableHead>
                <TableHead className="text-white no-print text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residents && residents.length > 0 ? (
                residents &&
                residents
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
                      <TableCell>
                        {moment(resident.resident_birthday).format('LL')}
                      </TableCell>
                      <TableCell>{resident.resident_houseno}</TableCell>
                      <TableCell>{resident.resident_purok}</TableCell>
                      <TableCell className="no-print">
                        <div className="flex gap-2">
                          <Link to={`/manage-resident/${resident.resident_id}`}>
                            <Button> View </Button>
                          </Link>

                          <Button
                            onClick={() =>
                              handleShowUpdateForm(resident.resident_id)
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
                                  {' '}
                                  <Button
                                    onClick={() =>
                                      handleDeleteResident(resident.resident_id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Button
                            onClick={() =>
                              handleShowClearanceForm(resident.resident_id)
                            }
                          >
                            Issue Clearance
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow className="text-center w-full">
                  Resident is empty
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {showAddResident && (
        <AddResident
          user_id={user_id}
          setShowAddResident={setShowAddResident}
          fetchResidents={fetchResidents}
        />
      )}

      {showUpdateForm && (
        <UpdateResident
          residentID={residentID}
          setShowUpdateForm={setShowUpdateForm}
          fetchResidents={fetchResidents}
        />
      )}

      {showReauth && (
        <VerifyPassword
          phpFile="resident"
          deleteIDColumn="resident_id"
          storeDeleteID={storeDeleteID}
          setShowReauth={setShowReauth}
          funcFunction={fetchResidents}
        />
      )}

      {showClearanceForm && (
        <div className="absolute w-full h-screen bg-white bg-opacity-75 py-[5rem] flex justify-center z-30 top-0">
          <div className="bg-white border-2 h-fit mt-[2rem] p-6 rounded-md w-[60%] ">
            <form onSubmit={handleSubmitClearance}>
              <div className="flex justify-around gap-5">
                <div className="w-full">
                  <div className="w-full">
                    <Label>Resident Name</Label>
                    <Input
                      disabled
                      defaultValue={residentName}
                      required
                      onChange={(e) => setResidentName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Birthday</Label>
                    <Input
                      disabled
                      defaultValue={residentBirthday}
                      required
                      onChange={(e) => setResidentBirthday(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input
                      disabled
                      defaultValue={residentAddress}
                      required
                      onChange={(e) => setResidentAddress(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <div>
                    <Label>Purpose</Label>
                    <Textarea
                      required
                      onChange={(e) => setResidentPurpose(e.target.value)}
                    ></Textarea>
                  </div>

                  <div>
                    <Label>Issued Date</Label>
                    <Input
                      onChange={(e) => setResidentIssuedDate(e.target.value)}
                      value={defaultDate}
                      type="date"
                    />
                  </div>

                  <div>
                    <Label>Valid Until</Label>
                    <Input
                      required
                      onChange={(e) => setResidentValidUntil(e.target.value)}
                      type="date"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full justify-end my-4">
                <Button onClick={() => setShowClearanceForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Clearance</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
