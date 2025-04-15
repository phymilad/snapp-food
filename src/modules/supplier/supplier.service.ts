import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SupplierSignUpDto } from './dto/supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../category/entities/category.entity';

@Injectable()
export class SupplierService {

  constructor(
    @InjectRepository(SupplierEntity) private supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>
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
