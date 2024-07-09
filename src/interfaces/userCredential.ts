import { Branch } from "src/entities/branch.entity";
import { Clients } from "src/entities/clients.entity";
import { EmployeeProfile } from "src/entities/employee.entity";
import { User } from "src/entities/user.entity";

export interface ISaveUserCredentials{
    id:number,
    name:string,
    userName:string,
    email:string,
    password:string,
    userType:string,
    client:Clients,
    clientId:number,
    branch:Branch,
    branchId:number,
    employeeProfile:EmployeeProfile,
    employeeProfileId:number,
    assignees:User,
    assigneeId:number
}