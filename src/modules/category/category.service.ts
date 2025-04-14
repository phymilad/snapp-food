// category.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async create(dto: CreateCategoryDto, imageFilename: string) {
    const category = this.categoryRepo.create({
      ...dto,
      image: imageFilename, // save image filename
    });
    return await this.categoryRepo.save(category);
  }
}
