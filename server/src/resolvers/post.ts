import { Post } from "./../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import "reflect-metadata";
import { MyContext } from "../types";
import { RequiredEntityData } from "@mikro-orm/core";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    return ctx.em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    return ctx.em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const post = ctx.em
      .fork()
      .create(Post, { title } as RequiredEntityData<Post>);
    await ctx.em.fork().persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const post = await ctx.em.fork().findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await ctx.em.fork().persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    try {
        await ctx.em.fork().nativeDelete(Post,{id});
    } catch {
        return false
    }
    return true ;
  }
}
