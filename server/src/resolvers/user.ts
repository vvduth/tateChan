import { COOKIE_NAME } from './../constants';
import { Session } from "express-session";
import { User } from "./../entities/User";
import { RequiredEntityData } from "@mikro-orm/core";
import { MyContext } from "./../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import "reflect-metadata";
import argon2 from "argon2";

function isLowerCase(str: string) {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}

@InputType()
class UsernamePasswordInput {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;
}

@ObjectType()
class FieldError {
  @Field(() => String)
  field?: string;

  @Field(() => String)
  message?: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req, em }: MyContext) {
    // if u are not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = em.fork().findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        error: [
          {
            field: "username",
            message: "username must be longer than 2 characters",
          },
        ],
      };
    }

    if (options.password.length <= 2) {
      return {
        error: [
          {
            field: "password",
            message: "password must be longer than 2 characters",
          },
        ],
      };
    }

    if (!isLowerCase(options.username)) {
      return {
        error: [
          {
            field: "username",
            message: "username can not have uppercase letter",
          },
        ],
      };
    }

    const user2 = await em.fork().findOne(User, { username: options.username });
    if (user2) {
      return {
        error: [
          {
            field: "username",
            message: "username existed",
          },
        ],
      };
    }
    const hasedPassword = await argon2.hash(options.password);

    const user = em.fork().create(User, {
      username: options.username,
      password: hasedPassword,
    } as RequiredEntityData<User>);
    try {
      await em.fork().persistAndFlush(user);
    } catch (err: any) {}

    // store user id session right after register
    // create userId filed in the session object

    try {
      req.session.userId = user.id;
      console.log("cookie step, sent");
    } catch (e) {
      console.log(e);
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.fork().findOne(User, { username: options.username });
    if (!user) {
      return {
        error: [
          {
            field: "username",
            message: "Username doesnot exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        error: [
          {
            field: "password",
            message: "Password is not correct",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req,res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err) ;
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
