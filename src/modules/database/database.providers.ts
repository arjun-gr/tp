import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../../config/typeorm.config';
import { Agents } from '../../entities/agents.entity';
import { Analytics } from '../../entities/analytics.entity';
import { AuthorizedToken } from '../../entities/authorized-token.entity';
import { AwarenessCamp } from '../../entities/awareness-camp.entity';
import { Blog } from '../../entities/blog.entity';
import { BranchProduct } from '../../entities/branch-products.entity';
import { Branch } from '../../entities/branch.entity';
import { City } from '../../entities/city.entity';
import { Clients } from '../../entities/clients.entity';
import { Collaterals } from '../../entities/collaterals.entity';
import { Country } from '../../entities/country.entity';
import { EmployeeProfile } from '../../entities/employee.entity';
import { FeaturePost } from '../../entities/feature-post.entity';
import { File } from '../../entities/file.entity';
import { Notifications } from '../../entities/notifications.entity';
import { PadcareFiles } from '../../entities/padcare-files.entity';
import { Products } from '../../entities/product.entity';
import { Purchase } from '../../entities/purchase.entity';
import { Roles } from '../../entities/roles.entity';
import { ServiceProduct } from '../../entities/service-product.entity';
import { Services } from '../../entities/services.entity';
import { SPOCS } from '../../entities/spoc.entity';
import { Ticket } from '../../entities/ticket.entity';
import { UserAssignee } from '../../entities/user-assignees.entity';
import { UserCity } from '../../entities/user-city.entity';
import { User } from '../../entities/user.entity';
import { Video } from '../../entities/video.entity';
import { States } from 'src/entities/states.entity';

const DATA_SOURCE = 'DATA_SOURCE';
export const USER_REPOSITORY = 'USER_REPOSITORY';
export const EMPLOYEE_PROFILE_REPOSITORY = 'EMPLOYEE_PROFILE_REPOSITORY';
export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';
export const CITY_REPOSITORY = 'CITY_REPOSITORY';
export const STATE_REPOSITORY = 'STATE_REPOSITORY';
export const COUNTRY_REPOSITORY = 'COUNTRY_REPOSITORY';
export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';
export const USER_CITY_REPOSITORY = 'USER_CITY_REPOSITORY';
export const USER_EXECUTIVE_REPOSITORY = 'USER_EXECUTIVE_REPOSITORY';
export const FILE_REPOSITORY = 'FILE_REPOSITORY';
export const CLIENT_REPOSITORY = 'CLIENT_REPOSITORY';
export const BRANCH_REPOSITORY = 'BRANCH_REPOSITORY';
export const SPOC_REPOSITORY = 'SPOC_REPOSITORY';
export const TICKET_REPOSITORY = 'TICKET_REPOSITORY';
export const AWARENESS_CAMP = 'AWARENESS_CAMP';
export const VIDEO_REPOSITORY = 'VIDEO_REPOSITORY';
export const COLLATERALS_REPOSITORY = 'COLLATERALS_REPOSITORY';
export const BLOG_REPOSITORY = 'BLOG_REPOSITORY';
export const SERVICE_REPOSITORY = 'SERVICE_REPOSITORY';
export const AGENT_REPOSITORY = 'AGENT_REPOSITORY';
// export const VENDING_MACHINE_REPOSITORY = 'VENDING_MACHINE_REPOSITORY';
// export const FEMALE_HYGIENE_UNIT_REPOSITORY = 'FEMALE_HYGIENE_UNIT_REPOSITORY';
export const ANALYTICS_REPOSITORY = 'ANALYTICS_REPOSITORY';
export const FEATURE_POST_REPOSITORY = 'FEATURE_POST_REPOSITORY';
export const BRANCH_PRODUCT_REPOSITORY = 'BRANCH_PRODUCT_REPOSITORY';
export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
export const PURCHASE_REPOSITORY = 'PURCHASE_REPOSITORY';
export const PADCARE_FILES_REPOSITORY = 'PADCARE_FILES_REPOSITORY';
export const INSTALLED_PRODUCT_REPOSITORY = 'INSTALLED_PRODUCT_REPOSITORY';
export const NOTIFICATION_REPOSITORY = 'NOTIFICATION_REPOSITORY';
export const SERVICE_PRODUCT_REPOSITORY = 'SERVICE_PRODUCT_REPOSITORY';

function dbProvider(providerName: string, entity: any) {
  return {
    provide: providerName,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(entity),
    inject: [DATA_SOURCE],
  };
}

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    name: 'primarydb',
    useFactory: async () => {
      const dataSource = new DataSource(typeOrmConfig);
      return dataSource.initialize();
    },
  },
  dbProvider(USER_REPOSITORY, User),
  dbProvider(EMPLOYEE_PROFILE_REPOSITORY, EmployeeProfile),
  dbProvider(ROLE_REPOSITORY, Roles),
  dbProvider(CITY_REPOSITORY, City),
  dbProvider(STATE_REPOSITORY,States),
  dbProvider(COUNTRY_REPOSITORY, Country),
  dbProvider(AUTH_REPOSITORY, AuthorizedToken),
  dbProvider(USER_CITY_REPOSITORY, UserCity),
  dbProvider(FILE_REPOSITORY, File),
  dbProvider(CLIENT_REPOSITORY, Clients),
  dbProvider(BRANCH_REPOSITORY, Branch),
  dbProvider(SPOC_REPOSITORY, SPOCS),
  dbProvider(TICKET_REPOSITORY, Ticket),
  dbProvider(AWARENESS_CAMP, AwarenessCamp),
  dbProvider(VIDEO_REPOSITORY, Video),
  dbProvider(COLLATERALS_REPOSITORY, Collaterals),
  dbProvider(BLOG_REPOSITORY, Blog),
  dbProvider(SERVICE_REPOSITORY, Services),
  dbProvider(AGENT_REPOSITORY, Agents),
  // dbProvider(VENDING_MACHINE_REPOSITORY, VendingMachine),
  // dbProvider(FEMALE_HYGIENE_UNIT_REPOSITORY, FemaleHygieneUnit),
  dbProvider(ANALYTICS_REPOSITORY, Analytics),
  dbProvider(FEATURE_POST_REPOSITORY, FeaturePost),
  dbProvider(BRANCH_PRODUCT_REPOSITORY, BranchProduct),
  dbProvider(PRODUCT_REPOSITORY, Products),
  dbProvider(PURCHASE_REPOSITORY, Purchase),
  dbProvider(PADCARE_FILES_REPOSITORY, PadcareFiles),
  dbProvider(NOTIFICATION_REPOSITORY, Notifications),
  dbProvider(USER_EXECUTIVE_REPOSITORY, UserAssignee),
  dbProvider(SERVICE_PRODUCT_REPOSITORY, ServiceProduct),
];
