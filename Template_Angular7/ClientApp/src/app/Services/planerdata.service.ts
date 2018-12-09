import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {Observable, Observer} from "rxjs";
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import {NgIf} from "@angular/common";
import {addDays, addHours, endOfMonth, startOfDay, subDays} from "date-fns";

@Injectable()
export class PlanerdataService {

  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string) {
  }

  loadTeilnehmer(id: number): Observable<Teilnehmer[]> {

    let myUrl: string;
    if (id > 0 ) {
      myUrl = this.baseUrl + "api/teilnehmer/alle/" + id;
    }
    else {
      myUrl = this.baseUrl + "api/teilnehmer/alle/0";  // alle holen
    }

    return this.http.get<Teilnehmer[]>(myUrl);
  }

  loadAktiviaeten(id: number): Observable<Code_aktivitaet[]> {
    let myUrl: string;
    if (id > 0 ) {
      myUrl = this.baseUrl + "api/codesaktivitaeten/alle/" + id;
    }
    else {
      myUrl = this.baseUrl + "api/codesaktivitaeten/alle/0";  // alle holen
    }

    return this.http.get<Code_aktivitaet[]>(myUrl);

    /*this.http.get<Code_aktivitaet[]>(myUrl).subscribe(res => {
        this.selAktivitaeten = res;
      },
      error => console.error(error));*/
  }

  loadTermine(myID: number): Observable<Termin[]> {
    let myUrl: string;
    if (myID > 0 ) {
      myUrl = this.baseUrl + "api/termine/alle/" + myID;
    }
    else {
      myUrl = this.baseUrl + "api/termine/alle/0";  // alle holen
    }

    return this.http.get<Termin[]>(myUrl);

    /*this.http.get<Termin[]>(myUrl).subscribe(res => {
      this.termine = res;
    }, error => console.error(error));*/
  }




   /* this.http.get<Termin[]>(myUrl).subscribe(res => {
      termine = res;
      if (termine.length > 0) {

          terminEvents = new Array(termine.length);
          for(let i=0; i<termine.length; i++){

            terminEvents[i].start = termine[i].Datum;
            terminEvents[i].color = colors.yellow;
          }
          return terminEvents;

        }
      },

      error => console.log(error)
    );
  }*/

  loadPlanerCalenderEvents(myID: number): Observable<CalendarEvent[]> {

    const colors: any = {
      red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
      },
      blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
      },
      yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
      }
    };


    let termine: Termin[];
    let calEvent: CalendarEvent;
    let terminEvents: CalendarEvent[];
    let myUrl: string;

    if (myID > 0) {
      myUrl = this.baseUrl + "api/termine/alle/" + myID;
    }
    else {
      myUrl = this.baseUrl + "api/termine/alle/0";  // alle holen
    }

    terminEvents = [];

    return Observable.create(observer => {
      setTimeout(() => {
          this.loadTermine(1)
            .subscribe((data) => {
                termine = data;

                if (termine.length > 0) {
                  for (let i = 0; i < termine.length; i++) {
                    calEvent = <CalendarEvent>{};
                    calEvent.start = new Date(termine[i].Datum);
                    calEvent.title = 'neuer Event' + i;
                    calEvent.color = colors.yellow;
                    terminEvents.push(calEvent);
                  }
                  observer.next(terminEvents);
                  observer.complete();
                }
              }
            );

        },10);
      }
    );
  }

}


