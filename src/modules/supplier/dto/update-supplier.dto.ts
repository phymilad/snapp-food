import { PartialType } from '@nestjs/mapped-types';
import { SupplierSignUpDto } from './supplier.dto';

export class UpdateSupplierDto extends PartialType(SupplierSignUpDto) {}
