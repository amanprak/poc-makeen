import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum roleName {
    regular = 'regular',
    manager = 'manager',
    globalManager = 'globalManager',
}
@Entity()
export class Role {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({
        type: 'enum',
        enum: roleName,
      })
    name: roleName;

    @Column("varchar", { array: true, nullable: true })
    groupids: string[];

}
