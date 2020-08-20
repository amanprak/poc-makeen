import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column("varchar", { array: true })
    roleids: string[];

}
