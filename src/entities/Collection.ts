import { Entity, PrimaryGeneratedColumn, Column ,OneToMany} from "typeorm";
import { Item } from "./Item";

@Entity()
export class Collection {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    name: string;

    // @ManyToOne((type)=>Groups,(group)=>group.id)
    // group:Promise<Groups>;
    @OneToMany((type) => Item, (item) => item.id)
    item: Promise<Item[]>;
}
