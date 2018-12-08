import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

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

}
