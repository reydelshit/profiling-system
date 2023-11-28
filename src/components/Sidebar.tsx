import { Link } from 'react-router-dom';
export default function Sidebar() {
  return (
    <div className="font-bold w-[15rem] h-screen flex flex-col items-center justify-center border-r-2">
      <div className="mt-[-15rem]">
        <Link className="p-2 mb-2 flex items-center gap-2" to="/">
          {/* <RxDashboard className="text-md h-[1.5rem] w-[1.5rem]" /> Dashboard */}
          Dashboard
        </Link>

        <Link
          className="p-2 mb-2 flex items-center gap-2"
          to="/manage-resident"
        >
          {/* <RxDashboard className="text-md h-[1.5rem] w-[1.5rem]" /> Dashboard */}
          Manage Resident
        </Link>

        <Link
          className="p-2 mb-2 flex items-center gap-2"
          to="/manage-household"
        >
          {/* <RxDashboard className="text-md h-[1.5rem] w-[1.5rem]" /> Dashboard */}
          Manage Household
        </Link>

        <Link className="p-2 mb-2 flex items-center gap-2" to="/settings">
          {/* <RxDashboard className="text-md h-[1.5rem] w-[1.5rem]" /> Dashboard */}
          Settings
        </Link>
      </div>
    </div>
  );
}
