import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook, BookServiceService, IBookID } from "../services/book-service.service";

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  addButtonDisabled = false;
  books: Observable<IBook[]>;
  readingNow: IBookID;
  syncedReadingNow: Observable<IBookID>;

  constructor(private bookServiceService: BookServiceService) { 
    this.books = this.bookServiceService.books;
  }

  add(bookTitle: HTMLInputElement) {
    if(bookTitle.value){
      const book: IBook = {
        name: bookTitle.value, 
        isRead: false,
      };
  
      this.addButtonDisabled = true;
  
      this.bookServiceService.add(book)
        .then(() => {
          bookTitle.value = '';
          this.addButtonDisabled = false;
         }
        );
    }
  }

  remove(book: IBookID) {
    this.bookServiceService.remove(book);
  }

  update(book: IBookID) {
    this.bookServiceService.update(book);
  }

  sync(id: string) {
    this.syncedReadingNow = this.bookServiceService.sync(id);
  }
  

  get(id: string) {
    this.bookServiceService.get(id).subscribe((data) => {
      this.readingNow = data;
    });
  }

  ngOnInit() {
  }

}
