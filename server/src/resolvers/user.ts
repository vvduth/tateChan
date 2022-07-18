import { User } from './../entities/User';
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

@InputType()
class UsernamePasswordInput {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;
}

@ObjectType()
class FieldError{
    @Field(() => String)
    field?: string ;

    @Field(()=> String)
    message?: string ;

}

@ObjectType() 
class UserResponse {
    @Field(() => [FieldError], {nullable:true})
    error?: FieldError[];
    
    @Field(() => User, {nullable:true})
    user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const hasedPassword = await argon2.hash(options.password);
    const user = em
      .fork()
      .create(User, {
        username: options.username,
        password: hasedPassword,
      } as RequiredEntityData<User>);
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ):Promise<UserResponse> {
    const user = await em.fork().findOne(User, {username: options.username}) ; 
    if (!user) {
        return{
            error: [{
                field: 'username',
                message: 'Username doesnot exist'
            }]
        }
    }
    const valid = await argon2.verify(user.password,options.password);
    if (!valid) {
        return{
            error: [{
                field: 'Password',
                message: 'Password is not correct'
            }]
        }
    }
    return {
        user,
    };
  }
}
