import { MyContext } from './types';
import { __prod__ } from './constants';
import { UserResolver } from "./resolvers/user";
import { PostResolver } from "./resolvers/post";
import { HelloResolver } from "./resolvers/hello";
import { MikroORM, RequiredEntityData } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import express from "express";
import mikcroConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import * as redis from 'redis';
import session from "express-session";
import http from 'http'
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';




let RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient({ legacyMode: true });


const main = async () => {
  const orm = await MikroORM.init(mikcroConfig); // return ap promise
  const emFork = orm.em.fork(); // <-- create the fork
  await orm.getMigrator().up();

  //   const post = emFork.create(Post, {title: 'Tristian Tate'} as RequiredEntityData<Post>)
  //   await emFork.persistAndFlush(post) ;

  const posts = await emFork.find(Post, {});
  console.log(posts);

  const app = express();
 
  await redisClient.connect();
  //hasdas

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true, 
        sameSite: 'none',
        secure: true  // cookie only works in https
      },
      saveUninitialized: false,
      secret: "123456789",
      resave: false,
    })
  );
  app.set('trust proxy', 1);

  const httpServer = http.createServer(app);
    const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })];

  const apolloServer = new ApolloServer({
    plugins,
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) : MyContext => ({ em: emFork, req, res }),

  });
  await apolloServer.start();

  const cors = {
    credentials: true,
    origin: ['https://studio.apollographql.com', 'http://localhost:3000']
}

  apolloServer.applyMiddleware({ app, cors });
  app.listen(5000, () => {
    console.log("App listen on port 5000");
  });
};

main().catch((err) => {
  console.error(err);
});
