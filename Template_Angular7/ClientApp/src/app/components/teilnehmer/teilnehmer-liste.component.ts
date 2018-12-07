import { Component, Inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "teilnehmer-liste",
  templateUrl: './teilnehmer-liste.component.html',
  styleUrls: ['./teilnehmer-liste.component.css']
})

export class TeilnehmerListeComponent implements OnChanges {
  @Input() myGruppe: Gruppe;
  myTeilnehmer: Teilnehmer[];
  title: string;
  showAllData: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              @Inject('BASE_URL') private baseUrl: string) {

    this.title = "Teilnehmer";
    this.myTeilnehmer = [];

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

  loadData(id: number) {
    let myUrl: string;
    if (id > 0 ) {
      myUrl = this.baseUrl + "api/teilnehmer/alle/" + id;
    }
    else {
      myUrl = this.baseUrl + "api/teilnehmer/alle/0";  // alle holen
    }

    this.http.get<Teilnehmer[]>(myUrl).subscribe(res => {
      this.myTeilnehmer = res;
    },
        error => console.error(error));
  }

  onCreate() {
    this.router.navigate(["teilnehmer/create", this.myGruppe.Id]);
  }

  onEdit(myTeilnehmer : Teilnehmer) {
    this.router.navigate(["/teilnehmer/edit", myTeilnehmer.Id]);
  }

  onDelete(myTeilnehmer: Teilnehmer) {
    if (confirm("Soll diesr Teilnehmer gelöscht werden?")) {
      let url = this.baseUrl + "api/teilnehmer/" + myTeilnehmer.Id;
      this.http
        .delete(url)
        .subscribe(res => {
          console.log("Teilnehmer " + myTeilnehmer.Id + " wurde gelöscht.");
          // refresh the question list
          this.loadData(0);
        }, error => console.log(error));
    }
  }
}
