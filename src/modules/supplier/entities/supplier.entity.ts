import { EntityNames } from "src/common/enums/entity.enum";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityNames.Supplier)
export class SupplierEntity {
    @PrimaryGeneratedColumn("increment")
    id: number
    
    @Column()
    phone: string
    
    @Column()
    manager_first_name: string
    
    @Column()
    manager_last_name: string
    
    @Column()
    store_name: string
    
    @Column()
    city: string

    @Column()
    invite_code: string

    // Relation with Category
    @Column({nullable: true})
    categoryId: number
    @ManyToOne(() => CategoryEntity, category => category.suppliers, {onDelete: "SET NULL"})
    category: CategoryEntity

    @Column({nullable: true})
    agentId: number | null
    @ManyToOne(() => SupplierEntity, supplier => supplier.subsets)
    agent: SupplierEntity
    @OneToMany(() => SupplierEntity, supplier => supplier.agent)
    subsets: SupplierEntity
}
