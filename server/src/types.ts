
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { Request, Response , Express} from "express";
import session from "express-session";

declare module 'express-session' {
    export interface SessionData {
      userId: number ;
    }
  }
export type MyContext = {
    em: EntityManager<IDatabaseDriver<Connection>>
    req: Request;
    res: Response ;
}