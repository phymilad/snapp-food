// category.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { isBoolean, toBoolean } from 'src/common/utils/function.utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(dto: CreateCategoryDto, imageFilename: string) {
    let { show, slug, title, parentId } = dto
    const existCategory = await this.findOneBySlug(slug)
    if(existCategory) throw new ConflictException("Already exist category!")
    if(isBoolean(show)) {
      show = toBoolean(show)
    }
    let parent: CategoryEntity | null = null
    if(parentId && !isNaN(parentId)) {
      parent = await this.findOneById(parentId)
    }
    console.log({show,
      title,
      parentId: parent?.id,
      image: imageFilename,
      slug})
    const category = this.categoryRepository.create({
      show,
      title,
      parentId: parent?.id,
      image: imageFilename,
      slug
    });
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    const [categories, count] = await this.categoryRepository.findAndCount({
      relations: {
        parent: true
      },
      select: {
        parent: {
          title: true,
          slug: true
        }
      }
    })
    return categories
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({slug})
  }
  async findOneById(id: number) {
    return await this.categoryRepository.findOneBy({id})
  }
}
