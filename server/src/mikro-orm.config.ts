import { User } from './entities/User';
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pathTs: undefined, // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
        glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
      },
    entities: [Post, User],
    dbName: 'tatechan',
    user: 'root',
    password: 'finland2022.',
    debug: process.env.NODE_ENV !== 'production',
    type: 'mysql'
} as Parameters<typeof MikroORM.init>[0] ; // as cont the type will be flw insteed of string