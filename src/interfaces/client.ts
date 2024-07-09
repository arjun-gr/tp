import { Clients } from 'src/entities/clients.entity';
import { AddBranchDto } from '../modules/client/dto/add-branch.dto';
import { BranchContractRequestDto } from '../modules/client/dto/branch-new-request.dto';
import { CreateClientDto } from '../modules/client/dto/create-client.dto';
import { UpdateClientDetailDto } from '../modules/client/dto/update-client-detail.dto';

export interface IPadcareFiles {
  fileIds: any[];
  fileType: any;
  user?: any;
  client?: any;
  city?: any;
  branch?: any;
  purchase?: any;
  service?: any;
  branchProduct?: any;
  serviceProduct?: any;
}

export interface DTO {
  createClientDto?: CreateClientDto;
  addBranch?: AddBranchDto;
  contractDto?: BranchContractRequestDto;
}

export interface ClientCreationDTO {
  newClient?: CreateClientDto;
  updateClient?: UpdateClientDetailDto;
}

export interface ISaveOrUpdateBranch {
  addBranch?: Partial<AddBranchDto>;
  updateClient?: Partial<UpdateClientDetailDto>;
}

export interface IConditions {
  id?: number | number[];
  where?: {};
  findOne?: boolean | true;
  relations?: {};
  select?: {};
  withDeleted?: boolean | false;
}

export interface ICreateClientEntity{
  id:number,
  name:string,
  logo:File,
  logoId:number,
  type:ClientTypes,
  industryType:string,
  ifmClient: Clients,
  ifmClientId:number,
  deletedAt:Date
}
