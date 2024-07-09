import { PartialType } from '@nestjs/mapped-types';
import { CreateFeaturePostDto } from './create-feature_post.dto';

export class UpdateFeaturePostDto extends PartialType(CreateFeaturePostDto) {}
