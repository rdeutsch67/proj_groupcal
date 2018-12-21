import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "gruppen-liste",
  templateUrl: './gruppen-liste.component.html',
  styleUrls: ['./gruppen-liste.component.css']
})

export class GruppenListeComponent {
  title: string;
  selectedGruppe: Gruppe;
  gruppen: Gruppe[];
  //count: number;

  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              @Inject('BASE_URL') private baseUrl: string) {

    this.title = "Verfügbare Gruppen";
    this.gruppen = [];

    let count = +this.activatedRoute.snapshot.params["count"];
    if (isNaN(count)) {
      count = 0;
    }
    this.loadData(count);
  }

  loadData(myCount: number) {
    console.log(myCount);
    let url = this.baseUrl + "api/gruppen/alle/" + myCount;
    this.http.get<Gruppe[]>(url).subscribe(result => {
      this.gruppen = result;
    }, error => console.error(error));
  }

  onCreate() {
    this.router.navigate(["gruppen/create"]);
  }

  onShowPlaner(gruppe : Gruppe){
    this.router.navigate(["kalender/"+ gruppe.Id]);
  }

  onEdit(gruppe : Gruppe) {
    this.onSelect(gruppe);
  }

  onDelete(gruppe : Gruppe) {
    if (confirm("Soll diese Gruppe gelöscht werden?")) {
      let url = this.baseUrl + "api/gruppen/" + gruppe.Id;
      this.http
        .delete(url)
        .subscribe(res => {
          console.log("Gruppe " + gruppe.Id + " wurde gelöscht.");
          // refresh the question list
          //this.loadData(0);
          this.router.navigate(["/gruppen/alle/10"]);
        }, error => console.log(error));
    }
  }

  onSelect(gruppe: Gruppe) {
    this.selectedGruppe = gruppe;
    console.log("quiz with Id " + this.selectedGruppe.Id + " ist ausgewählt.");
    /*this.router.navigate(["gruppen", this.selectedGruppe.Id]);*/
    this.router.navigate(["gruppen/edit", this.selectedGruppe.Id]);
  }
}

