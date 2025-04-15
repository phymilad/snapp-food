// category.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { isBoolean, toBoolean } from 'src/common/utils/function.utils';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
    const category = this.categoryRepository.create({
      show,
      title,
      parentId: parent?.id,
      image: imageFilename,
      slug
    });
    return await this.categoryRepository.save(category);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, skip, page } = paginationSolver(paginationDto.page, paginationDto.per_page)
    const [categories, count] = await this.categoryRepository.findAndCount({
      relations: {
        parent: true
      },
      select: {
        parent: {
          title: true,
          slug: true
        }
      },
      take: limit,
      skip,
      order: {id: "DESC"}
    })
    return {
      pagination: paginationGenerator(count, page, limit),
      data: categories
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, imageFilename: string) {
    console.log(id, updateCategoryDto)
    const updateObject: Partial<CategoryEntity> = {}
    const {parentId, show, slug, title} = updateCategoryDto
    const category = await this.findOneById(id)
    if(!category) throw new NotFoundException("Not found category")
    if(imageFilename) updateObject.image = imageFilename
    if(show && isBoolean(show)) updateObject.show = toBoolean(show)
    if(title) updateObject.title = title
    if(parentId && !isNaN(parseInt(parentId.toString()))) {
      const category = await this.findOneById(+parentId)
      if(!category) throw new NotFoundException("Not found parent category")
      updateObject.parentId = category.id
    }
    if(slug) {
      const category = await this.findOneBySlug(slug)
      if(category && category.id !== id) throw new NotFoundException("Category slug already exist")
      updateObject.slug = slug
    }
    await this.categoryRepository.update({id}, updateObject)
    return {
      message: "Updated successfully"
    }
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({slug})
  }
  async findOneById(id: number) {
    return await this.categoryRepository.findOneBy({id})
  }

  async remove(id: number) {
    const category = await this.findOneById(id);
    if (!category) throw new NotFoundException("Not found category");
    await this.categoryRepository.delete({id});
    return {
      message: "Deleted successfully"
    };
  }

  async findCategoriesBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({where: {slug}, relations: {children: true}})
    if(!category) throw new NotFoundException("Category not found");
    return { category };
  }

}
