import { getManager, Repository } from 'typeorm';
import { Collection } from '../entities/Collection';

export class CollectionService {
    collectionRepository: Repository<Collection>;

    constructor() {
        this.collectionRepository = getManager().getRepository(Collection);
    }

    createCollection(data: Object): Collection | undefined {
        return this.collectionRepository.create(data);
    }

    async insert(data: Collection): Promise<Collection> {
        console.log('Create a new collection', data);
        const newCollection = this.collectionRepository.create(data);
        return await this.collectionRepository.save(newCollection);
    }

    async getAll(): Promise<Collection[]> {
        return await this.collectionRepository.find();
    }

    async getById(id: string | number): Promise<Collection> {
        console.log('Fetching collection by id: ', id);
        if (id) {
            return await this.collectionRepository.findOne(id);
        }
        return Promise.reject(false);
    }

    async update(collection: Collection): Promise<Collection | undefined> {
        try {
            const updatedCollection = await this.collectionRepository.save(collection);
            return updatedCollection;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async remove(id: string): Promise<object> {
        try {
            const updatedCollection = await this.collectionRepository.delete(id);
            return { message: "Record Deleted" };
        } catch (error) {
            return (error);
        }
    }

    async idCheck(data: string[]): Promise<boolean> {
        try {
            for (const id of data) {
                let collection=await this.collectionRepository.findOne(id);
                console.log("Collections---->",collection);
                
                if(collection===undefined){
                    return false;
                }
            }
            return true;
        } catch (error) {
            return false;            
        }
    }

    async hasGroup(id: string): Promise<string[]> {
        const users = await this.collectionRepository.query(`select UNNEST(g.collectionids) from groups g where '${id}' = ANY(g.collectionids)`);
        if (users && users.length > 0) {
            let finalRes=[];
            for (const iterator of users) {
            console.log("iterator---->",iterator.unnest);
            
              finalRes.push(Object(iterator).unnest)
            }          
            return finalRes;
        } else {
            return undefined;
        }
    }
}
