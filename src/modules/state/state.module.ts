import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StateController } from './state.controller';
import { stateProviders } from './state.provider';
import { StateService } from './state.service';

@Module({
  imports: [DatabaseModule],
  controllers: [StateController],
  providers: [...stateProviders, StateService],
  exports: [StateService],
})
export class StateModule {}
