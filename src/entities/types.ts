export type ClearanceType = {
  clearance_id: number;
  resident_name: string;
  resident_address: string;
  resident_birthday: string;
  resident_purpose: string;
  resident_issued: string;
  resident_until: string;
};

export type Household = {
  house_id: number;
  house_no: string;
  house_purok: string;
  house_address: string;
  resident_count: string;
};

export type Resident = {
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

  user_id: number;
};
