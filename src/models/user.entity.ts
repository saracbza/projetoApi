import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm"
import Token from "./token.entity"
import Task from "./Task"
import Document from "./doc.entity"

@Entity()
@Unique(["email"])
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    email!: string

    @Column()
    password!: string

    @OneToMany(() => Token, token => token.user)
    tokens?: Token[]

    @OneToMany(() => Task, task => task.user)
    tasks!: Task[]

    @OneToMany(() => Document, document => document.user)
    documents!: Document[]
}