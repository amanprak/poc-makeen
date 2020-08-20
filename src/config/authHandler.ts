import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt';

import { Strategy } from 'passport';
import config from '../config/config';
import { Users } from '../entities/Users';
import { UserService } from '../services/userService';
import { RoleService } from '../services/roleService';
import { GroupService } from '../services/groupService';

const { auth } = config;

export class AuthHandler {

  jwtOptions: StrategyOptions;
  superSecret = auth.secretKey;

  constructor() {
    this.jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.superSecret
    };
  }

  initialize() {
    passport.use('jwt', this.getStrategy());
    return passport.initialize();
  }

  getStrategy(): Strategy {
    return new JWTStrategy(this.jwtOptions, async (jwt_payload, next) => {
      const userService = new UserService();

      try {
        const user = await userService.getByEmail(jwt_payload.email); 

        if (!user) {
          return next(null, false);
        }
        let role = [];
        let group = [];
        const roleService = new RoleService();
        const groupService = new GroupService();
        for (const i of user.roleids) {
          console.log("Role---->",i);
          // console.log(await roleService.getById(i));
          let currRole=await roleService.getById(i);
          role.push(Object(currRole));
          if(currRole.groupids && currRole.groupids != null){
            for (const j of currRole.groupids) {
              group.push(Object(await groupService.getById(j)))
            }
          }
        }

        return next(undefined, Object({
          id: user.id,
          email: user.email,
          role: role,
          group: group
        }));

      } catch (err) {
        console.log("Error----->",err);
        
        return next(null, false);
      }
    });
  }

  authenticate() {
    return passport.authenticate('jwt', { session: false, failWithError: true });
  }

  // /**
  //  * Generate JWT token.
  //  * @param user
  //  */
  generateToken(user: Users): string {
    const token = jwt.sign({
      id: user.id,
      email: user.email,
    }, this.superSecret, {
        expiresIn: '5d',
      });

    return token;

  }
}
