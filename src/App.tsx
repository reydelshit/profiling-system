import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from './components/ui/label';

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

function App() {
  const [genderPie, setGenderPie] = useState([]) as any[];
  const [agePie, setAgePie] = useState([]) as any[];

  const [residents, setResidents] = useState<Resident[]>([]);
  const [barangayCaptain, setBarangayCaptain] = useState<string>('');
  const [barangaySecretary, setBarangaySecretary] = useState<string>('');
  const [barangayTreasurer, setBarangayTreasurer] = useState<string>('');

  const user_id = localStorage.getItem('profiling_token') as string;

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

  const fetchBarangayOfficials = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/officials.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.length > 0) {
          if (res.data[0].official_type === 'Barangay Captain')
            setBarangayCaptain(res.data[0].official_name);
          if (res.data[1].official_type === 'Barangay Secretary')
            setBarangaySecretary(res.data[1].official_name);
          if (res.data[2].official_type === 'Barangay Treasurer')
            setBarangayTreasurer(res.data[2].official_name);
        }
      });
  };

  const getGenderPie = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/pie-chart-gender.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data, 'gender');
        const gender = res.data.map(
          (stat: { count: number; gender: string }, index: number) => {
            return {
              id: index,
              value: stat.count,
              name: stat.gender,

              color:
                stat.gender.toLowerCase() === 'male'
                  ? 'purple'
                  : stat.gender.toLowerCase() === 'female'
                  ? 'yellow'
                  : 'pink',
            };
          },
        );
        // console.log(gender, 'gender');
        setGenderPie(gender);
      });
  };

  const getAgeGroup = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/pie-chart-age.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        const age = res.data.map(
          (stat: { count: number; age_group: string }, index: number) => {
            return {
              id: index,
              value: stat.count,
              name: stat.age_group,

              color:
                stat.age_group.toLowerCase() === 'child'
                  ? 'purple'
                  : stat.age_group.toLowerCase() === 'teenager'
                  ? 'green'
                  : stat.age_group.toLowerCase() === 'adult'
                  ? 'yellow'
                  : 'pink',
            };
          },
        );
        console.log(age, 'age');
        setAgePie(age);
      });
  };

  useEffect(() => {
    Promise.all([
      fetchResidents(),
      fetchBarangayOfficials(),
      getAgeGroup(),
      getGenderPie(),
    ]);
  }, []);

  return (
    <div className="w-full px-[5rem]">
      <h1 className="text-6xl my-10 font-bold">DASHBOARD</h1>
      <div className="flex gap-4 w-full justify-around ">
        <Card className="text-start bg-[#1A4D2E] text-white w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              TOTAL RESIDENTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residents.length}</div>
            <p className="text-xs text-muted-foreground text-white">
              Total number of residents registered in the system
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-10 justify-around my-4">
        <div className="flex w-[70%] p-2 py-[2rem] gap-[1rem] bg-[#1A4D2E] rounded-lg text-white">
          <div className="flex items-center ">
            <PieChart
              series={[
                {
                  data: genderPie,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -90,
                  endAngle: 180,
                  cx: 150,
                  cy: 150,
                },
              ]}
              width={350}
              height={300}
            />
          </div>
          <div className="w-full">
            <h1 className="font-bold text-2xl mb-2">PIE CHART FOR GENDER</h1>

            <div className="cursor-pointer text-start justify-between flex items-center font-bold h-[4rem] p-2 bg-white text-black w-full rounded-lg px-2">
              <h1 className="flex item-center">
                <span className="mr-2 text-xl font-bold">
                  {residents.length} - Total Combined
                </span>{' '}
              </h1>
              <span className="font-bold text-3xl">{'>'}</span>
            </div>
            <div className="grid grid-cols-2 place-content-center place-items-center gap-7 mt-[2rem] ">
              <span className="flex items-center gap-2 bg-purple-900 p-4 rounded-xl font-bold w-full">
                Male
              </span>

              <span className="flex items-center gap-2 bg-yellow-400 p-4 rounded-xl font-bold w-full text-black">
                Female
              </span>
            </div>
          </div>
        </div>

        <div className="w-[40%] bg-[#1A4D2E]  text-white rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Purok/Zone</TableHead>
                <TableHead className="text-white">Population</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {
                      residents.filter(
                        (res) => parseInt(res.resident_purok) === index + 1,
                      ).length
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex h-full gap-2 items-center">
        <div className="text-2xl p-5 w-[70%] bg-[#1A4D2E] rounded-lg text-white h-full">
          <div>
            <Label>Barangay Captaion</Label>
            <p className="font-bold">{barangayCaptain}</p>
          </div>

          <div>
            <Label>Barangay Secretary</Label>
            <p className="font-bold">{barangaySecretary}</p>
          </div>

          <div>
            <Label>Barangay Treasurer</Label>
            <p className="font-bold">{barangayTreasurer}</p>
          </div>
        </div>

        <div className="flex w-[70%] p-2 gap-[2rem]">
          <div className="flex items-center">
            <PieChart
              series={[
                {
                  data: agePie,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -90,
                  endAngle: 180,
                  cx: 150,
                  cy: 150,
                },
              ]}
              width={350}
              height={300}
            />
          </div>
          <div className="w-full ">
            <h1 className="font-bold text-2xl mb-2 mt-[2rem]">
              PIE CHART FOR AGE
            </h1>

            <div className="flex gap-7 mt-[2rem] ">
              <div className="mb-2">
                <span className="flex items-center gap-2 mb-2">
                  <div className="bg-green-600 rounded-sm p-4 w-[2rem] "></div>{' '}
                  Teenager
                </span>
                <span className="flex items-center gap-2">
                  <div className="bg-purple-900 rounded-sm p-4 w-[2rem]"></div>{' '}
                  Child
                </span>
              </div>
              <div>
                <span className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-400 rounded-sm p-4 w-[2rem]"></div>{' '}
                  Adult
                </span>

                <span className="flex items-center gap-2">
                  <div className="bg-pink-400 rounded-sm p-4 w-[2rem]"></div>{' '}
                  Senior
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
