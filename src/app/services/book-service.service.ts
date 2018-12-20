import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';

export interface IBook {
  name: string;
  isRead: boolean;
}
export interface IBookID extends IBook { 
  id: string; 
}

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {
  books: Observable<IBook[]>;
  bookCollection: AngularFirestoreCollection<IBook>;

  constructor(private afs: AngularFirestore) {
    this.bookCollection = this.afs.collection('books', (reference) => {
      return reference
      .orderBy('name')
    });
    this.books = this.bookCollection.snapshotChanges()
      .pipe(map(this.includeCollectionID));
   }

   includeCollectionID(docChangeAction) {
    return docChangeAction.map((a) => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return {id, ...data };
    })
   };

   handleError(error: Error) {
     console.log(error);
   }
  
   add(book: IBook) {
    return this.bookCollection.add(book)
      .catch(this.handleError);
   }

   remove(book:IBookID) {
     console.log(book)
     this.bookCollection.doc(book.id).delete();
   }

   update(book: IBookID) {
     let payload ={
       isRead: book.isRead,
      }
     this.bookCollection.doc(book.id).update(payload);
   }

   sync(id: string) {
    return this.bookCollection.doc(id)
      .valueChanges() as Observable<IBookID>;
   }

   get(id: string) {
     return this.bookCollection.doc(id).get()
      .pipe(map(
       (payload) => {
          return payload.data() as IBookID;
        }
      ));
   }
}
