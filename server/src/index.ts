import {MikroORM, RequiredEntityData} from "@mikro-orm/core"
import { Post } from "./entities/Post";
import mikcroConfig from './mikro-orm.config'

const main =async () => {
    const orm = await  MikroORM.init(mikcroConfig) ; // return ap promise
    const emFork = orm.em.fork(); // <-- create the fork
    await orm.getMigrator().up() ;

    // const post = emFork.create(Post, {title: 'Andrew Tate'} as RequiredEntityData<Post>)
    // await emFork.persistAndFlush(post) ;

    const posts = await emFork.find(Post, {})
    console.log(posts);    

}


main().catch((err) => {
    console.error(err);
  });