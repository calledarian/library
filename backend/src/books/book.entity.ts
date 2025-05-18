import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Book {
    @PrimaryColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @CreateDateColumn({ type: 'date' })
    createdAt: string;
}
