import { Component, Inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {PlanerdataService} from "../../services/planerdata.service";
import {Observable} from "rxjs";
import {GlobalVariables} from "../../global.variables";

@Component({
  selector: "teilnehmer-liste",
  templateUrl: './teilnehmer-liste.component.html',
  styleUrls: ['./teilnehmer-liste.component.css']
})

export class TeilnehmerListeComponent implements OnChanges {
  @Input() myGruppe: Gruppe;
  myTeilnehmer: VTeilnehmer[];
  title: string;
  selectedTeilnehmer: VTeilnehmer;
  showAllData: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              private dataService: PlanerdataService,
              private globals: GlobalVariables,
              @Inject('BASE_URL') private baseUrl: string) {

    this.title = "Teilnehmer";
    this.myTeilnehmer = [];

    let id = +this.activatedRoute.snapshot.params["id"];  // Id der Gruppe
    this.showAllData = id <= 0;
    if (this.showAllData) {
      this.loadVTeilnehmer(0);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['myGruppe'] !== "undefined") {

      // retrieve code_aktivitaet variable change info
      let change = changes['myGruppe'];
      // only perform the task if the value has been changed
      //if (!change.isFirstChange()) {
      // execute the Http request and retrieve the result
      this.loadVTeilnehmer(this.myGruppe.Id);
      //}
    }
  }

  loadVTeilnehmer(id: number) {

    this.dataService.loadVTeilnehmer(id).subscribe( res => {
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
          this.loadVTeilnehmer(0);
        }, error => console.log(error));
    }
  }
}
