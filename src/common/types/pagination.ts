import { PageOptionsDto } from '../dto/page-options.dto';

// export type SortOrder = 'ASC' | 'DESC';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type PageMetaDtoParameters = {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
};
