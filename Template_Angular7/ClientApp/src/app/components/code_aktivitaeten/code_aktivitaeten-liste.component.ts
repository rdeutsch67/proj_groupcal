import { Component, Inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "code_aktivitaeten-liste",
  templateUrl: './code_aktivitaeten-liste.component.html',
  styleUrls: ['./code_aktivitaeten-liste.component.css']
})

export class Code_aktivitaetenListeComponent implements OnChanges {
  @Input() myGruppe: Gruppe;
  code_aktivitaeten: Code_aktivitaet[];
  title: string;
  showAllData: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              @Inject('BASE_URL') private baseUrl: string) {

    this.title = "Aktivitäten";
    this.code_aktivitaeten = [];

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
      myUrl = this.baseUrl + "api/codesaktivitaeten/alle/" + this.myGruppe.Id;
    }
    else {
      myUrl = this.baseUrl + "api/codesaktivitaeten/alle/0";  // alle holen
    }

    this.http.get<Code_aktivitaet[]>(myUrl).subscribe(res => {
      this.code_aktivitaeten = res;
    }, error => console.error(error));
  }

  onCreate() {
    /*this.router.navigate(["codesaktivitaeten/create", this.myGruppe.Id]);*/
    this.router.navigate(["codesaktivitaeten/create", this.myGruppe.Id]);
  }

  onEdit(code_aktivitaet : Code_aktivitaet) {
    this.router.navigate(["/codesaktivitaeten/edit", code_aktivitaet.Id]);
  }

  onDelete(code_aktivitaet: Code_aktivitaet) {
    if (confirm("Soll diese Aktivität gelöscht werden?")) {
      let url = this.baseUrl + "api/codesaktivitaeten/" + code_aktivitaet.Id;
      this.http
        .delete(url)
        .subscribe(res => {
          console.log("Aktivität " + code_aktivitaet.Id + " wurde gelöscht.");
          // refresh the question list
          this.loadData(0);
        }, error => console.log(error));
    }
  }
}
