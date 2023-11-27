import AddResident from './manage-resident/AddResident';
import { Button } from './ui/button';
import { useState } from 'react';

export default function ManageResident() {
  const [showAddResident, setShowAddResident] = useState<boolean>(false);
  return (
    <div className=" w-full h-full">
      <h1>Manage Resident</h1>
      <Button onClick={() => setShowAddResident(!showAddResident)}>
        New Resident
      </Button>

      <div className="relative h-full">
        {showAddResident && (
          <AddResident setShowAddResident={setShowAddResident} />
        )}
      </div>
    </div>
  );
}
