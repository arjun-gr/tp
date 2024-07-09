import { EmployeeType } from '../../common/enums/employee-type';

export const cityResponse = (data: any) => {
  let res = [];
  for (const item of data) {
    let user = item.users
      .filter(
        (user: any) =>
          user?.employeeProfile?.type == EmployeeType.CITY_OPS_MANAGER,
      )
      .map((val: any) => ({ name: val.name }));
    res.push({
      id: item.id,
      isActive: item.isActive,
      createdAt: item.createdAt,
      name: item.name,
      tier: item.tier,
      franchise: item.franchise,
      noOfClients: item.noOfClients,
      user: user.length ? user : null,
    });
  }
  return res;
};
