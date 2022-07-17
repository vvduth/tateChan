import { PostResolver } from './resolvers/post';
import { HelloResolver } from "./resolvers/hello";
import { MikroORM, RequiredEntityData } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import express from "express";
import mikcroConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata"

const main = async () => {
  const orm = await MikroORM.init(mikcroConfig); // return ap promise
  const emFork = orm.em.fork(); // <-- create the fork
  await orm.getMigrator().up();

//   const post = emFork.create(Post, {title: 'Tristian Tate'} as RequiredEntityData<Post>)
//   await emFork.persistAndFlush(post) ;

  const posts = await emFork.find(Post, {});
  console.log(posts);

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: ({req, res}) => ({em: emFork})
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(5000, () => {
    console.log("App listen on port 5000");
  });
};

main().catch((err) => {
  console.error(err);
});
