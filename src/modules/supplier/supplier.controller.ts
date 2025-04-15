import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierSignUpDto } from './dto/supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post("sign-up")
  signUp(@Body() SupplierSignUpDto: SupplierSignUpDto) {
    this.supplierService.signUp(SupplierSignUpDto)
  }

  @Get()
  findAll() {
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }
}
