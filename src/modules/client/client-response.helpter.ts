import { EmployeeType } from '../../common/enums/employee-type';
import { Branch } from '../../entities/branch.entity';

export function clientResponseStructure(branches: Branch[]) {
  let arr = [];
  for (const data of branches) {
    let branch: any = {};
    branch.id = data.client.id;
    branch.branchId = data.id;
    branch.status = data.isActive;
    branch.clientName = data.client.name;
    branch.branchName = data.name;
    branch.startDate = data.contractStartDate;
    branch.userName = data.user.userName;
    branch.userId = data.user.id;
    branch.city = data.city?.name;
    branch.cityId = data.city?.id;
    branch.userRole = data.user.userType;
    branch.tenture = '';
    branch.type = data.client.type;
    // branch.fhuProductType = data.fhuProductType;
    // branch.vmProductType = data.vmProductType;
    const user = data.city?.users.filter(
      (user: any) =>
        user?.employeeProfile?.type == EmployeeType.CITY_OPS_MANAGER,
    );

    branch.cityManager = user[0]?.name || '';
    // branch.soNumber = data.soNumber;
    branch.email = data?.user?.email;
    // branch.poNumber = data?.poNumber || null;
    arr.push(branch);
  }
  return arr;
}

function dateDiff(startingDate, endingDate) {
  let startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
  if (!endingDate) {
    endingDate = new Date().toISOString().substr(0, 10); // need date in YYYY-MM-DD format
  }
  let endDate = new Date(endingDate);
  if (startDate > endDate) {
    const swap = startDate;
    startDate = endDate;
    endDate = swap;
  }
  const startYear = startDate.getFullYear();
  const february =
    (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
      ? 29
      : 28;
  const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let yearDiff = endDate.getFullYear() - startYear;
  let monthDiff = endDate.getMonth() - startDate.getMonth();
  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }
  let dayDiff = endDate.getDate() - startDate.getDate();
  if (dayDiff < 0) {
    if (monthDiff > 0) {
      monthDiff--;
    } else {
      yearDiff--;
      monthDiff = 11;
    }
    dayDiff += daysInMonth[startDate.getMonth()];
  }

  return yearDiff + 'Y ' + monthDiff + 'M ' + dayDiff + 'D';
}

export function clientListRes(clients: Branch[]) {
  if (!clients.length) return [];
  let arr = [];
  for (const client of clients) {
    let data: any = {};
    (data.userId = client.id), (data.clientName = client.client.name);
    arr.push(data);
  }
  return arr;
}
