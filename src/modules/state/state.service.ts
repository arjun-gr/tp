import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { States } from '../../entities/states.entity';
import { CreateStateDto } from './dto/request/create-state.dto';
import { UpdateStateDto } from './dto/request/update-state.dto';
import { StateResponseCodes } from './state.response.codes';

@Injectable()
export class StateService {
  constructor(
    @Inject('STATE_REPOSITORY')
    private readonly stateRepository: Repository<States>,
  ) {}

  async create(createStateDto: CreateStateDto) {
    try {
      const state: States = plainToClass(States, createStateDto);
      await this.stateRepository.save(state);
      return state;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw StateResponseCodes.EXITS;
      } else {
        throw StateResponseCodes.BAD_REQUEST;
      }
    }
  }

  findAll(): Promise<States[]> {
    return this.stateRepository.find({
      where: { isActive: true },
      relations: { country: true },
    });
  }

  findById(id: number): Promise<States> {
    return this.stateRepository.findOne({
      where: { id, isActive: true },
      relations: { country: true },
    });
  }

  async update(id: number, updateStateDto: UpdateStateDto) {
    const state = await this.findById(id);
    if (!state) throw new Error();
    return this.stateRepository.update(id, updateStateDto);
  }

  async remove(id: number) {
    const state = await this.findById(id);
    if (!state) throw new Error();
    return this.stateRepository.softDelete(id);
  }
}
