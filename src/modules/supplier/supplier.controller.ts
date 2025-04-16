import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplementaryInformationDto, SupplierSignUpDto } from './dto/supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { SupplierAuth } from 'src/common/decorators/auth.decorator';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post("sign-up")
  signUp(@Body() SupplierSignUpDto: SupplierSignUpDto) {
    this.supplierService.signUp(SupplierSignUpDto)
  }

  @Post("check-otp")
  checkOtp(@Body() otpDto: CheckOtpDto) {
    this.supplierService.checkOtp(otpDto)
  }

  @Post("supplementary-information")
  @SupplierAuth()
  supplementaryInformation(@Body() infoDto: SupplementaryInformationDto) {
    this.supplierService.saveSupplimentaryInformation(infoDto)
  }

}
