import { IsEmail, IsIdentityCard, IsMobilePhone, Length } from "class-validator"

export class SupplierSignUpDto {
    categoryId: number
    @Length(3,50)
    store_name: string
    city: string
    @Length(3,50)
    manager_first_name: string
    @Length(3,50)
    manager_last_name: string
    @IsMobilePhone("fa-IR", {}, {message: "Mobile number is invalid"})
    phone: string
    invite_code: string
}

export class SupplementaryInformationDto {
    @IsEmail()
    email: string
    @IsIdentityCard("IR")
    national_code: string
}