import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    // @ManyToOne((type)=>Role,(role)=>role.id)
    // @JoinColumn({ name: "roleids" })
    // roleids:Role[];
    @Column("varchar", { array: true })
    roleids: string[];

}
