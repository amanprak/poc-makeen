import { Entity, PrimaryGeneratedColumn, Column ,ManyToOne, JoinColumn} from "typeorm";
import { Collection } from "./Collection";

@Entity()
export class Item {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    name: string;

    @ManyToOne((type)=>Collection,(collection)=>collection.id)
    @JoinColumn({ name: "collectionid" })
    collection:Promise<Collection>;

}
