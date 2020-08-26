import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Groups } from "./Groups";

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

    // @Column("varchar", { array: true, nullable: true })
    // @OneToMany((type) => Groups, (group) => group.id)
    // group: Groups;
    @ManyToOne((type)=>Groups,(group)=>group.role)
    @JoinColumn({ name: "groupids" })
    groupids:Groups;

}
