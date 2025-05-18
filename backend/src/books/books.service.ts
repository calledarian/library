import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
    ) { }

    async addBook(book: Book): Promise<Book> {
        const createdBook = await this.bookRepository.save(book);
        console.log(`${createdBook.title} by ${createdBook.author} has created at ${createdBook.createdAt}.`);
        return createdBook;
    }

    async getBooks(): Promise<Book[]> {
        return this.bookRepository.find();
    }

    async getBookById(id: number): Promise<Book | null> {
        if (!Book) {
            throw new Error(`Book with ID:${id} not found.`)
        }
        return this.bookRepository.findOneBy({ id });
    }

    async deleteBookById(id: number): Promise<void> {
        // Check if the book exists first
        const book = await this.bookRepository.findOne({ where: { id } });

        if (!book) {
            throw new NotFoundException(`Book with ID:${id} not found.`);
        }

        // If the book exists, delete it
        await this.bookRepository.delete({ id });
        console.log(`Book by ID:${id} has deleted.`)
    }

    async updateBookById(id: number, updateData: Partial<Book>): Promise<Book> {
        const book = await this.bookRepository.findOne({ where: { id } });  // Corrected query

        if (!book) {
            throw new NotFoundException(`Book with ID:${id} not found`);
        }

        // Update the book properties with the provided data
        Object.assign(book, updateData);

        return this.bookRepository.save(book);
    }
}