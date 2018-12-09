import { Component, Inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "termin-liste",
  templateUrl: './termin-liste.component.html',
  styleUrls: ['./termin-liste.component.css']
})

export class TerminListeComponent implements OnChanges {
  @Input() myGruppe: Gruppe;
  termine: Termin[];
  title: string;
  showAllData: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              @Inject('BASE_URL') private baseUrl: string) {

    this.title = "Alle Termine zur Gruppe";
    this.termine = [];

    let id = +this.activatedRoute.snapshot.params["id"];  // Id der Gruppe
    this.showAllData = id <= 0;
    if (id <= 0) {
      this.loadData(id);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['myGruppe'] !== "undefined") {

      // retrieve code_aktivitaet variable change info
      let change = changes['myGruppe'];
      // only perform the task if the value has been changed
      //if (!change.isFirstChange()) {
        // execute the Http request and retrieve the result
        this.loadData(this.myGruppe.Id);
      //}
    }
  }

  loadData(myID: number) {
    let myUrl: string;
    if (myID > 0 ) {
      myUrl = this.baseUrl + "api/termine/alle/spez/" + this.myGruppe.Id;
    }
    else {
      myUrl = this.baseUrl + "api/termine/alle/0";  // alle holen
    }

    this.http.get<Termin[]>(myUrl).subscribe(res => {
      this.termine = res;
    }, error => console.error(error));
  }

  onCreate() {
    this.router.navigate(["termine/create", this.myGruppe.Id]);
  }

  onEdit(termin : Termin) {
    this.router.navigate(["/termine/edit", termin.Id]);
  }

  onDelete(termin: Termin) {
    if (confirm("Soll dieser Termin gelöscht werden?")) {
      let url = this.baseUrl + "api/termine/" + termin.Id;
      this.http
        .delete(url)
        .subscribe(res => {
          console.log("Termin " + termin.Id + " wurde gelöscht.");
          // refresh the question list
          this.loadData(0);
        }, error => console.log(error));
    }
  }
}
