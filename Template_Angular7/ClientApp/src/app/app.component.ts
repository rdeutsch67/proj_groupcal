import {Component, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, Subscription} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {GlobalVariables} from "./global.variables";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'app';

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  constructor(private breakpointObserver: BreakpointObserver,
              private globals: GlobalVariables) {}

  ngOnInit() {
    this.globals.bp_isSmScreen = this.breakpointObserver.isMatched(Breakpoints.Handset);
    this.globals.bp_isSmScrPrt = this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait);
    this.globals.bp_isMidScreen = this.breakpointObserver.isMatched(Breakpoints.Tablet);
    this.globals.bp_isWideScreen = this.breakpointObserver.isMatched(Breakpoints.Web);

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      console.log('event: ', evt)
      this.globals.bp_isSmScreen = this.breakpointObserver.isMatched(Breakpoints.Handset);
      this.globals.bp_isSmScrPrt = this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait);
      this.globals.bp_isMidScreen = this.breakpointObserver.isMatched(Breakpoints.Tablet);
      this.globals.bp_isWideScreen = this.breakpointObserver.isMatched(Breakpoints.Web);
    });
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe()
  }
}
