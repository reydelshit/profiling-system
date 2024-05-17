import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

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

import DOMPurify from 'dompurify';

import md5 from 'md5';
import moment from 'moment';
import { useToast } from './ui/use-toast';
import useLog from './useLog';
import { Link } from 'react-router-dom';

type ProfileType = {
  user_id: string;
  username: string;
  password: string;
  created_at: string;
  fullname: string;
};

export default function UserProfile() {
  // xss payload
  // <img src='nevermind' onerror="alert('HACKED USING XSS');" />

  const [barangayName, setBarangayName] = useState<string>('');

  // sanitize dom input
  const sanitizeBarangayName = DOMPurify.sanitize(barangayName);

  const [barangayCaptain, setBarangayCaptain] = useState<string>('');
  const [barangaySecretary, setBarangaySecretary] = useState<string>('');
  const [barangayTreasurer, setBarangayTreasurer] = useState<string>('');

  const [barangayAddress, setBarangayAddress] = useState<string>('');

  const [profileName, setProfileName] = useState<string>('' as string);

  const user_id = localStorage.getItem('profiling_token') as string;

  const [profile, setProfile] = useState<ProfileType>({} as ProfileType);
  const [profileOldPassword, setProfileOldPassword] = useState<string>(
    '' as string,
  );
  const [profileOldPasswordInput, setProfileOldPasswordInput] =
    useState<string>('');
  const [profilePassword, setProfilePassword] = useState<string>('');
  const [profileNewPassword, setProfileNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const fetchProfile = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/profile.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data, 'profile');
        setProfile(res.data[0]);
        setProfileOldPassword(res.data[0].password);
      });
  };

  const handleUpdateProfile = () => {
    // if (profileName === '') return setError('Fullname is required');

    axios
      .put(`${import.meta.env.VITE_PROFILING}/profile.php`, {
        user_id: user_id,
        fullname: profileName.length > 0 ? profileName : profile.fullname,
      })
      .then((res) => {
        console.log(res.data);
        // window.location.reload();
        if (res.data.status == 'success') {
          toast({
            style: { background: '#1A4D2E', color: 'white' },
            title: 'Profle Updated Successfully 🎉',
            description: moment().format('LLLL'),
          });
          // fetchClearance();

          window.location.reload();

          useLog(
            `You have updated your profile`,
            'Update',
          ).handleUploadActivityLog();
        }
      });
  };

  const handleUpdatePassword = () => {
    fetchProfile();

    console.log(
      profileOldPassword,
      md5(profileOldPasswordInput),
      profilePassword,
    );

    if (profileOldPassword !== md5(profileOldPasswordInput))
      return setError('Old password is incorrect');

    if (profilePassword !== profileNewPassword)
      return setError('New password does not match');

    axios
      .put(`${import.meta.env.VITE_PROFILING}/password.php`, {
        user_id: user_id,
        password: md5(profileNewPassword),
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status == 'success') {
          toast({
            style: { background: '#1A4D2E', color: 'white' },
            title: 'Password Changed Successfully 🎉',
            description: moment().format('LLLL'),
          });

          window.location.reload();

          useLog(
            `You have updated your password`,
            'Update',
          ).handleUploadActivityLog();
        }
      });
  };

  return (
    <div className="w-full flex flex-col px-[5rem]">
      <h1 className="text-6xl my-10 font-bold uppercase text-start">
        User Profile
      </h1>

      <div className="flex justify-center items-center">
        <div className="w-[40rem]">
          <div className="flex flex-col gap-2">
            <Label className="my-2 font-bold text-xl">Account Settings</Label>

            <AlertDialog>
              <AlertDialogTrigger className=" w-full">
                {' '}
                <Button onClick={fetchProfile} className="w-full">
                  Update Profile
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Change Profile</AlertDialogTitle>
                  <AlertDialogDescription>
                    <Input
                      placeholder="Fullname"
                      onChange={(e) => setProfileName(e.target.value)}
                      defaultValue={profile.fullname}
                    />

                    {error && <p className="text-red-500">{error}</p>}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUpdateProfile}>
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger className=" w-full">
                {' '}
                <Button onClick={fetchProfile} className="w-full">
                  Change Password
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Change Profile</AlertDialogTitle>
                  <AlertDialogDescription className="flex flex-col gap-2">
                    <Input
                      type="password"
                      placeholder="Old Password"
                      onChange={(e) =>
                        setProfileOldPasswordInput(e.target.value)
                      }
                    />

                    <Input
                      type="password"
                      placeholder="New Password"
                      onChange={(e) => setProfileNewPassword(e.target.value)}
                    />

                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      onChange={(e) => setProfilePassword(e.target.value)}
                    />

                    {error && <p className="text-red-500">{error}</p>}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button onClick={handleUpdatePassword}>Save</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button>
              <Link to="/user-profile/activity-log">View Activity Log</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 
      <div className="w-[40rem]">
        <h1 className="font-bold my-5">Barangay Purok's</h1>

        <div className="w-full flex flex-col">
          <Label className="my-2">Add Purok</Label>
          <Input />
          <Button type="submit" className="my-2 self-end">
            Save
          </Button>
        </div>
      </div> */}
    </div>
  );
}
