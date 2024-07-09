import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EmployeeType } from '../common/enums/employee-type';
import { Role } from '../common/enums/roles';
import { User } from '../entities/user.entity';

export const AuthUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const {
      user: { id, role },
    } = ctx.switchToHttp().getRequest();
    try {
      switch (role) {
        case Role.SUPER_ADMIN:
          return getUser(id, null, role);
        case Role.EMPLOYEE:
          return getUser(
            id,
            ['employeeProfile', 'cities', 'cities.users'],
            role,
          );
        case Role.CLIENT:
          return getUser(
            id,
            [
              'client',
              'client.logo',
              'branch',
              'branch.city',
              'branch.city.users',
              'branch.city.users.employeeProfile',
            ],
            role,
          );
        default:
          return getUser(id, null, role);
      }
    } catch (error) {
      console.log('user.decorator.ts :: AuthUser ==> ', error);
    }
  },
);

const getUser = async (id: number, relation: any, role: any) => {
  const user = await User.findOne({
    where: { id },
    relations: relation,
  });
  if (role == Role.EMPLOYEE) {
    const cityIds = user?.cities?.map((val) => val.id);
    return { ...user, cityIds };
  }
  if (role == Role.CLIENT) {
    const clientId = user?.client?.id;
    const branchId = user?.branch?.id;
    const cityManager = user?.branch?.city?.users?.find(
      (i) => i.employeeProfile.type == EmployeeType.CITY_OPS_MANAGER,
    );
    return {
      ...user,
      clientId,
      branchId,
      cityManager: {
        id: cityManager?.id,
        name: cityManager?.name,
        city: {
          id: user?.branch?.city?.id,
          name: user?.branch?.city?.name,
        },
      },
    };
  }
  return user;
};
