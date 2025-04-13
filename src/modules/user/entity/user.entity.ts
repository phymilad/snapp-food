import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserAddressEntity } from "./address.entity";

@Entity(EntityNames.User)
export class UserEntity {
    @PrimaryGeneratedColumn("increment")
    id: number
    @Column({unique: true})
    mobile: string
    @Column({nullable: true})
    first_name: string
    @Column({nullable: true})
    last_name: string
    @Column({nullable: true, unique: true})
    email: string
    @Column({unique: true})
    invite_code: string
    @Column({default: 0})
    score: number
    @Column({nullable: true, unique: true})
    agent_id: number
    @CreateDateColumn({type: "time with time zone"})
    created_at: Date
    @UpdateDateColumn({type: "time with time zone"})
    updated_at: Date
    @OneToMany(() => UserAddressEntity, address => address.user)
    addressList: UserAddressEntity[]
}