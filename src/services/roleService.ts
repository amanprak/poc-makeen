import { getManager, Repository } from 'typeorm';
import { Role } from '../entities/Role';

export class RoleService {
    roleRepository: Repository<Role>;

    constructor() {
        this.roleRepository = getManager().getRepository(Role);
    }

    createRole(data: Object): Role | undefined {
        return this.roleRepository.create(data);
    }

    async insert(data: Role): Promise<Role> {
        console.log('Create a new role', data);
        const newRole = this.roleRepository.create(data);
        return await this.roleRepository.save(newRole);
    }

    async getAll(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    async getById(id: string | number): Promise<Role> {
        console.log('Fetching role by id: ', id);
        if (id) {
            return await this.roleRepository.findOne(id);
        }
        return Promise.reject(false);
    }

    async update(role: Role): Promise<Role | undefined> {
        try {
            const updatedRole = await this.roleRepository.save(role);
            return updatedRole;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async remove(id: string): Promise<object> {
        try {
            const updatedRole = await this.roleRepository.delete(id);
            return { message: "Record Deleted" };
        } catch (error) {
            return (error);
        }
    }

    async idCheck(data: string[]): Promise<boolean> {
        try {
            for (const id of data) {
                let collection = await this.roleRepository.findOne(id);
                console.log("Roles---->", collection);

                if (collection === undefined) {
                    return false;
                }
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    async hasGroup(groupId: string): Promise<string[]> {
        const users = await this.roleRepository.query(`select distinct(c.id) from collection c inner join groups g on c.id::VARCHAR = ANY(g.collectionids) where g.id='${groupId}'`);
        if (users && users.length > 0) {
            let finalRes=[];
            for (const iterator of users) {
            console.log("iterator---->",iterator.id);
            
              finalRes.push(Object(iterator).id)
            }          
            return finalRes;
        } else {
            return undefined;
        }
    }
}
