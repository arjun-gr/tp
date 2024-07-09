import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { Roles } from '../../entities/roles.entity';
import { ROLE_REPOSITORY } from '../database/database.providers';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private roleRepository: Repository<Roles>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const role: Roles = plainToClass(Roles, createRoleDto);
    return this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find({
      where: { isActive: true },
      select: ['id', 'name'],
    });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: { id, isActive: true },
      select: ['id', 'name'],
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) throw new NotFoundException('Role not Found!');
    return this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (!role) throw new NotFoundException('Role not Found!');
    return this.roleRepository.softDelete(id);
  }
}
