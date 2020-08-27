import { UserService } from "./services/userService";

// import { Users } from './entities/Users'
const userService = new UserService();
async function test() {
    return userService.query( "users", "1=1", {})
}

test().then(res => {
    console.log("Res----->", res);

})