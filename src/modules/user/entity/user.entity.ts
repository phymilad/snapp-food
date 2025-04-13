import { EntityNames } from "src/common/enums/entity.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityNames.USER)
export class UserEntity {
    @PrimaryGeneratedColumn("increment")
    id: number
    @Column()
    first_name: string
    @Column()
    last_name: string
    @Column()
    email: string
    @Column()
    invite_code: string
    @Column()
    agent_id: string
}