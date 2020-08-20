import { Entity, PrimaryGeneratedColumn, Column,OneToMany } from "typeorm";
import { Collection } from "./Collection";

@Entity()
export class Groups {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    name: string;

    // @OneToMany((type) => Collection, (collection) => collection.id)
    // collection: Promise<Collection[]>;

    @Column("varchar", { array: true, nullable: true  })
    collectionids: string[];

}
