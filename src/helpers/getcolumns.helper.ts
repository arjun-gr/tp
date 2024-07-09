export const getcityColumns = () => {
  return {
    id: true,
    name: true,
    tier: true,
    franchise: true,
    noOfClients: true,
  };
};

export const getEmployeeProfileColumns = () => {
  return {
    id: true,
    // profilePic: true,
    phoneNumber: true,
    designation: true,
    division: true,
    jobType: true,
    type: true,
  };
};

export const getRolesColumn = () => {
  return {
    id: true,
    name: true,
  };
};
