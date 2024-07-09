import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Products } from '../../entities/product.entity';
import { PRODUCT_REPOSITORY } from '../database/database.providers';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private productsRepository: Repository<Products>,
  ) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  getProducts(type: string) {
    return this.productsRepository.find({
      where: {
        type: type,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product Not Exists');
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async throwIfBranchNotExists(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id, isActive: true },
    });
    if (!product) throw new Error('Product Not found');
    return product;
  }

  async throwIfProductNotExists(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id, isActive: true },
    });
    if (!product) throw new NotFoundException('Product Not found');
    return product;
  }
}
