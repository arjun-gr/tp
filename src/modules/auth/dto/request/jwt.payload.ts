export class JWTPayload {
  id: number;
  userName: string;
  role: string;
  employeeType: string;

  constructor(
    id: number,
    userName: string,
    role: string,
    employeeType: string,
  ) {
    this.id = id;
    this.userName = userName;
    this.role = role;
    this.employeeType = employeeType;
  }
}
