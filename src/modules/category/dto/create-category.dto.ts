import { IsBoolean, IsNumber, IsString } from "class-validator"

export class CreateCategoryDto {
    @IsString()
    title: string
    @IsString()
    slug: string
    @IsString()
    image: string
    @IsBoolean()
    show: boolean
    @IsNumber()
    parentId: number
}
