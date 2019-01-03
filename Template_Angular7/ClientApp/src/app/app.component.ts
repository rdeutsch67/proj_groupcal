import {Component, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'app';

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  ngOnInit() {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      console.log('event: ', evt)
    });
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe()
  }
}
