import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class User {
    
  @Field(() => Int)
  @PrimaryKey({ type: 'number' })
  id!: number

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt: Date = new Date()

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  // exppose these atribute to graph ql schema
  @Field(() => String)
  @Property({ type: 'text' , unique: true})
  username!: string

  // exppose these atribute to graph ql schema
  // dont expose it to graphsql , it will be a harshed passwrold
  @Property({ type: 'text' })
  password!: string
}

