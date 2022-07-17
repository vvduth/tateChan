import { Post } from './../entities/Post';
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import "reflect-metadata";
import { MyContext } from '../types';

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(
        @Ctx() ctx: MyContext
    ): Promise<Post[]>{
        return ctx.em.find(Post,{})
    }

    @Query(() => Post,{nullable: true})
    post(
        @Arg('id', () => Int) id: number ,
        @Ctx() ctx: MyContext
    ): Promise<Post | null>{
        return ctx.em.findOne(Post,{id})
    }

    
}