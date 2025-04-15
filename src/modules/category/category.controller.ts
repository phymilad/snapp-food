// categories.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  Query,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories', // where to save the image
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateCategoryDto,
  ) {
    return this.categoryService.create(body, file?.filename);
  }
  
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.categoryService.findAll(pagination)
  }

  @Patch("/:id")
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.update(id, updateCategoryDto, file?.filename)
  }

  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }

  @Get("/by-slug/:slug")
  findBySlug(@Param("slug") slug: string) {
    return this.categoryService.findCategoriesBySlug(slug);
  }

}