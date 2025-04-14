export class CreateCategoryDto {
    title: string;
    slug: string;
    show: boolean;
    parentId?: number;
  }