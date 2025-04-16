import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SupplementaryInformationDto, SupplierSignUpDto } from './dto/supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../category/entities/category.entity';
import { randomInt } from 'crypto';
import { SupplierOtpEntity } from './entities/otp.entity';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { TokensPayload } from '../auth/types/payload';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IUSER } from '../user/interface/user-request.interface';
import { SupplierStatus } from './enums/status.enum';

@Injectable()
export class SupplierService {

  constructor(
    @InjectRepository(SupplierEntity) private supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(SupplierOtpEntity) private supplierOtpRepository: Repository<SupplierOtpEntity>,
    private jwtService: JwtService,
    @Inject(REQUEST) private request: Request
  ) {}

  async signUp(SupplierSignUpDto: SupplierSignUpDto) {
    const { categoryId, city, invite_code, manager_first_name, manager_last_name, phone, store_name } = SupplierSignUpDto
    const supplier = await this.supplierRepository.findOneBy({phone})
    if (supplier) throw new ConflictException("Supplier with this phone number already exist")
    const category = await this.categoryRepository.findOneBy({id: categoryId})
    if (!category) throw new NotFoundException("Category not found")
    
    let agent: SupplierEntity | null = null
    if(invite_code) {
      agent = await this.supplierRepository.findOneBy({invite_code})
    }

    const supplierInviteCode = parseInt(phone).toString(32).toUpperCase()

    const account = this.supplierRepository.create({
      categoryId: category.id,
      manager_first_name,
      manager_last_name,
      city,
      store_name,
      phone,
      invite_code: supplierInviteCode,
      agentId: agent?.id ?? null,
    })
    await this.supplierRepository.save(account)
    await this.createOtpForSupplier(account)
    return {
      message: "Otp code sent successfully"
    }
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const {code, mobile} = otpDto;
    const now = new Date();
    const supplier = await this.supplierRepository.findOne({
      where: {phone: mobile},
      relations: {
        otp: true,
      },
    });
    if (!supplier || !supplier?.otp)
      throw new UnauthorizedException("Not Found Account");
    const otp = supplier?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException("Otp code is incorrect");
    if (otp.expires_in < now)
      throw new UnauthorizedException("Otp Code is expired");
    if (!supplier.phone_verify) {
      await this.supplierRepository.update(
        {id: supplier.id},
        {
          phone_verify: true,
        }
      );
    }
    const {accessToken, refreshToken} = this.makeTokens({
      id: supplier.id
    });
    return {
      accessToken,
      refreshToken,
      message: "You logged-in successfully",
    };
  }

  async createOtpForSupplier(supplier: SupplierEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.supplierOtpRepository.findOneBy({supplierId: supplier.id});
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("otp code not expired");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.supplierOtpRepository.create({
        code,
        expires_in: expiresIn,
        supplierId: supplier.id,
      });
    }
    otp = await this.supplierOtpRepository.save(otp);
    supplier.otpId = otp.id;
    await this.supplierRepository.save(supplier);
  }

  makeTokens(payload: TokensPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "30d",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "1y",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveSupplimentaryInformation(infoDto: SupplementaryInformationDto) {
    const { id } = this.request.user as IUSER
    const { email, national_code } = infoDto
    let supplier = await this.supplierRepository.findOneBy({national_code})
    if(supplier && supplier.id !== id) {
      throw new ConflictException("National code already exists")
    }
    supplier = await this.supplierRepository.findOneBy({email})
    if(supplier && supplier.id !== id) {
      throw new ConflictException("Email already exists")
    }
    await this.supplierRepository.update({id}, {email, national_code, status: SupplierStatus.SupplementaryInformation})
    return {
      message: "Update information successfully"
    }
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokensPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === "object" && payload?.id) {
        const user = await this.supplierRepository.findOneBy({id: payload.id});
        if (!user) {
          throw new UnauthorizedException("login on your account ");
        }
        return user;
      }
      throw new UnauthorizedException("login on your account ");
    } catch (error) {
      throw new UnauthorizedException("login on your account ");
    }
  }

  findAll() {
  }

  findOne(id: number) {
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
  }

  remove(id: number) {
  }
}
