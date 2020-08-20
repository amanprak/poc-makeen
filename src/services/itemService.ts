import { getManager, Repository } from 'typeorm';
import { Item } from '../entities/Item';

export class ItemService {
    itemRepository: Repository<Item>;

    constructor() {
        this.itemRepository = getManager().getRepository(Item);
    }

    createItem(data: Object): Item | undefined {
        return this.itemRepository.create(data);
    }

    async insert(data: Item): Promise<Item> {
        console.log('Create a new item', data);
        const newItem = this.itemRepository.create(data);
        return await this.itemRepository.save(newItem);
    }

    async getAll(): Promise<Item[]> {
        return await this.itemRepository.find();
    }

    async getById(id: string | number): Promise<Item> {
        console.log('Fetching item by id: ', id);
        if (id) {
            return await this.itemRepository.findOne(id);
        }
        return Promise.reject(false);
    }

    async update(item: Item): Promise<Item | undefined> {
        try {
            const updatedItem = await this.itemRepository.save(item);
            return updatedItem;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async remove(id: string): Promise<object> {
        try {
            const updatedItem = await this.itemRepository.delete(id);
            return { message: "Record Deleted" };
        } catch (error) {
            return (error);
        }
    }
    async getItemByGroup(groupId: string):Promise<Item | undefined>{
        const item = await this.itemRepository.query(`select distinct(i.*) from item i inner join collection c on c.id::VARCHAR = i.collectionid::VARCHAR inner join groups g on c.id::VARCHAR=ANY(g.collectionids) where g.id='${groupId}'`);
        if (item && item.length > 0) {
            return item;  
          } else {
            return undefined;
          }
        }
    
}
