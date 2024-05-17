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
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

export default function Clearance() {
  const [searchClearance, setSearchClearance] = useState<string>('');
  const [clearance, setClearance] = useState<ClearanceType[]>([]);

  const user_id = localStorage.getItem('profiling_token') as string;
  const { toast } = useToast();
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
        if (res.data.status == 'success') {
          toast({
            style: { background: '#1A4D2E', color: 'white' },
            title: 'Clearance Deleted Successfully 🎉',
            description: moment().format('LLLL'),
          });
          fetchClearance();
        }
      });
  };

  const componentRef = useRef<HTMLTableRowElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current || null,
  });

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
                <TableRow
                  ref={componentRef}
                  className="text-center"
                  key={index}
                >
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

                  <TableCell className="flex justify-center gap-2">
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
                            This action cannot be undone. This will permanently
                            delete and remove the data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>
                            <Button
                              onClick={() =>
                                handleDeleteClearance(clearance.clearance_id)
                              }
                            >
                              Delete
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button onClick={handlePrint}>Export</Button>

                    {/* <ClearancePrint clearance={clearance} /> */}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
