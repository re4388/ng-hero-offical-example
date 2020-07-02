import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../interface/hero';
import { HeroService } from '../service/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {

  /* variables */
  heroes$: Observable<Hero[]>;

  // Subject 是可觀察物件的資料來源，本身也是 Observable
  // 你可以像訂閱任何 Observable 一樣訂閱 Subject
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  // 透過呼叫Subject的 next(value) 方法往 Observable 中推送一些值
  // 每當使用者在文字框中輸入時，這個事件繫結就會使用文字框的值去呼叫 search()
  // searchTerms 變成了一個能發出搜尋詞的穩定的流
  search(term: string): void {
    this.searchTerms.next(term);
  }

  /* 每當使用者擊鍵後就直接呼叫 searchHeroes() 將導致建立海量的 HTTP 請求，
  浪費伺服器資源並干擾資料排程計劃 so we can use below chaining RxJS operators to reduce
  the number of calls to the searchHeroes()*/
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switchMap发出时会取消前一个observable的订阅，然后订阅一个新的 observable
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }
}
