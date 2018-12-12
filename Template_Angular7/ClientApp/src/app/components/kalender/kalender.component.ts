import {Component, ChangeDetectionStrategy, ViewChild, TemplateRef, ViewEncapsulation, OnInit, Input} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
  CalendarView, DateFormatterParams,
  DAYS_OF_WEEK
} from 'angular-calendar';
import {PlanerdataService} from "../../Services/planerdata.service";
import {ActivatedRoute, Router} from "@angular/router";
import {formatDate} from "@angular/common";

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  }
};

class CustomDateFormatter extends CalendarDateFormatter {

  public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
    return formatDate(date, 'EEE', locale); // use short week days
  }

}

@Component({
  selector: 'kalender.component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['kalender.component.css'],
  templateUrl: 'kalender.component.html',
  styles: [
      `
      .odd-cell {
        background-color: #eeffee !important;
      }
      .weekend-cell {
        background-color: #ecf7ff !important;
      }
    `
  ],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: CustomDateFormatter
  }]
})

export class KalenderComponent {
  @ViewChild('modalContent')

  events: CalendarEvent[] = [];
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
  modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  locale: string = 'de-ch';
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  clickedDate: Date;
  currentIdGruppe: number;
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private modal: NgbModal,
              private loadDataService: PlanerdataService) {

    let id = +this.activatedRoute.snapshot.params["id"];
    this.currentIdGruppe = id;
    this.loadDataService.loadPlanerCalenderEvents(id).subscribe(res => {
        this.events = res;
        this.refresh.next();
      },
      error => console.error(error)
    )
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
        day.badgeTotal = 0;

        // aktueller Tag einfÃ¤rben
        if (day.date.getDate() == new Date().getDate()) {
          day.cssClass = 'odd-cell';
        }

        // Wochenende einfÃ¤rben
        if ((day.date.getDay() == 0) || (day.date.getDay() == 6)) {
          day.cssClass = 'weekend-cell';
        }

        // Summieren
        if (this.events) {
          this.events.forEach(myElement => {
              if (day.inMonth && (day.date.getDate() >= myElement.start.getDate()) &&
                (day.date.getDate() <= myElement.end.getDate())) {
                if (myElement.meta === 'sum') {
                  day.badgeTotal++;
                }
              }
            }
          )
        }
      }
    )
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      this.clickedDate = date;

      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  onCreateTermin() {
    //this.router.navigate(["termine/create", this.currentIdGruppe]);
    this.router.navigate(['termine/new_event', { id: this.currentIdGruppe, myday: this.clickedDate }]);
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd
                    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
}
