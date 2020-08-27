import { getManager, Repository } from 'typeorm';
import { Groups } from '../entities/Groups';
import { RoleService } from './roleService';

export class GroupService {
    groupRepository: Repository<Groups>;

    constructor() {
        this.groupRepository = getManager().getRepository(Groups);
    }

    createGroup(data: Object): Groups | undefined {
        return this.groupRepository.create(data);
    }

    async insert(data: Groups): Promise<Groups> {
        console.log('Create a new group', data);
        const newGroup = this.groupRepository.create(data);
        return await this.groupRepository.save(newGroup);
    }

    async getAll(): Promise<Groups[]> {
        return await this.groupRepository.find();
    }

    async getById(id: string | number): Promise<Groups> {
        console.log('Fetching group by id: ', id);
        if (id) {
            return await this.groupRepository.findOne(id);
        }
        return Promise.reject(false);
    }

    async update(group: Groups): Promise<Groups | undefined> {
        try {
            const updatedGroup = await this.groupRepository.save(group);
            return updatedGroup;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getByRole(id: string): Promise<string | undefined> {
        try {
            const roleService = new RoleService();
            const roleDetails=Object(await roleService.getById(id));
            console.log("Role Details----->",roleDetails);
            if(roleDetails.groupId && roleDetails.groupId!=null){
                const finalRes=await this.groupRepository.findOne(roleDetails.groupId);
                return Object(finalRes).id;
            }else{
                return Promise.reject("Role Not Found");
            }
            
            // return updatedGroup;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async remove(id: string): Promise<object> {
        try {
            const updatedGroup = await this.groupRepository.delete(id);
            return { message: "Record Deleted" };
        } catch (error) {
            return (error);
        }
    }

    async idCheck(data: string[]): Promise<boolean> {
        try {
            for (const id of data) {
                let collection=await this.groupRepository.findOne(id);
                console.log("Roles---->",collection);
                
                if(collection===undefined){
                    return false;
                }
            }
            return true;
        } catch (error) {
            return false;            
        }
    }
}
