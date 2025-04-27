import { Entity, PrimaryColumn, Column } from 'typeorm';


@Entity()
export class Book {

    @PrimaryColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

}