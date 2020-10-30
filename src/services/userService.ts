import { getManager, Repository, getRepository } from 'typeorm';
import { Users } from '../entities/Users';

export class UserService {
  userRepository: Repository<Users>;

  constructor() {
    this.userRepository = getManager().getRepository(Users);
  }

  createUser(data: Object): Users | undefined {
    return this.userRepository.create(data);
  }

  async insert(data: Users): Promise<Users> {
    console.log('Create a new user', data);
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  async getAll(): Promise<Users[]> {
    return await this.userRepository.find();
  }

  async getById(id: string | number): Promise<Users> {
    console.log('Fetching user by id: ', id);
    if (id) {
      return await this.userRepository.findOne(id);
    }
    return Promise.reject(false);
  }

  async update(user: Users): Promise<Users | undefined> {
    try {
      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async remove(id: string): Promise<object> {
    try {
      const updatedUser = await this.userRepository.delete(id);
      return { message: "Record Deleted" };
    } catch (error) {
      return (error);
    }
  }

  async getByEmail(email: string): Promise<Users | undefined> {
    const users = await this.userRepository.find({
      where: {
        email: email
      }
    });
    if (users && users.length > 0) {
      return users[0];
    } else {
      return undefined;
    }
  }

  // async getUserByGroup(groupId: string): Promise<Users | undefined> {
  //   const users = await this.userRepository.query(`select distinct(u.*) from groups g inner join role r on g.id::VARCHAR = ANY(r.groupids) inner join users u on r.id::VARCHAR=ANY(u.roleids) where g.id='${groupId}'`);
  //   if (users && users.length > 0) {
  //     return users;
  //   } else {
  //     return undefined;
  //   }
  // }
  async getUserByGroup(filter: any): Promise<Users | undefined> {
    const users = await this.userRepository.query(`select distinct(u.*) from groups g inner join role r on g.id = r.groupids inner join users u on r.id::VARCHAR=ANY(u.roleids)${filter.directStatement}`).catch(err=>{
      console.log("Error---->",err);
      
    });
    console.log("Users----->",users);
    
    if (users && users.length > 0) {
      return users;
    } else {
      return undefined;
    }
  }
  async query(tableName,queryStatement,queryCondition){
    const res = await getRepository(Users)
    .createQueryBuilder("user")
    .select(tableName)
    .from(Users, tableName)
    .where(queryStatement, queryCondition)
    .getMany();
    return res;
  }
}
