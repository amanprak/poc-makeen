import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Collection } from "./Collection";
import { Role } from "./Role";

@Entity()
export class Groups {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    name: string;

    // @OneToMany((type) => Collection, (collection) => collection.id)
    // collection: Promise<Collection[]>;

    @Column("varchar", { array: true, nullable: true })
    collectionids: string[];

    @OneToMany((type) => Role, (role) => role.groupids)
    role: Role;
}
