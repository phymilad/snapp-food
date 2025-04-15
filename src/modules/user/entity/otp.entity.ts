import { EntityNames } from "src/common/enums/entity.enum";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.Otp)
export class OtpEntity {
    @PrimaryGeneratedColumn("increment")
    id: number
    @Column()
    code: string
    @Column()
    expires_in: Date
    @Column()
    userId: number
    @OneToOne(() => UserEntity, user => user.otp, {onDelete: "CASCADE"})
    user: UserEntity
}