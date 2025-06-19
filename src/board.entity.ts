import { Entity, ObjectIdColumn, Column, ObjectId } from "typeorm";

@Entity('posts')
export class Board {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    password: string;

    @Column()
    content: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}