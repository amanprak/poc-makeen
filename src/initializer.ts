import "reflect-metadata";
import { createConnection } from "typeorm";
import { CollectionService } from "./services/collectionService";
import { Collection } from "./entities/Collection";
import { GroupService } from "./services/groupService";
import { Groups } from "./entities/Groups";
import { RoleService } from "./services/roleService";
import { Role, roleName } from "./entities/Role";
import { UserService } from "./services/userService";
import { Users } from "./entities/Users";
import * as dotenv from 'dotenv';

dotenv.config();

createConnection().then(async connection => {
    // const collectionService = new CollectionService();
    // const collection = new Collection();
    // collection.name= "Admin Collection";
    // await collectionService.createCollection(collection);
    // let collectionResponse =await collectionService.insert(collection);


    // const groupService = new GroupService();
    // const group = new Groups();
    // group.name = "Admin"

    const roleService = new RoleService();
    const role = new Role();
    role.name = roleName.globalManager;
    role.groupids = null;
    await roleService.createRole(role);
    let roleResponse =await roleService.insert(role);

    const userService = new UserService();
    const user = new Users();
    user.email = process.env.ADMIN_EMAIL;
    user.roleids = [(roleResponse.id).toString()];
    await userService.createUser(user);
    await userService.insert(user);
    process.exit(0);
}).catch(error => console.log(error));
