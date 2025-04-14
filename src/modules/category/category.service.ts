// category.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(dto: CreateCategoryDto, imageFilename: string) {
    const { show, slug, title, parentId } = dto
    const existCategory = await this.findOneBySlug(slug)
    if(existCategory) throw new ConflictException("Already exist category!")
    const category = this.categoryRepository.create({
      show,
      title,
      parentId,
      image: imageFilename,
      slug
    });
    return await this.categoryRepository.save(category);
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({slug})
  }
}
