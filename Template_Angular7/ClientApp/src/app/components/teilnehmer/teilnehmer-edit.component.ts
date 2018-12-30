import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavbarService} from "../../services/navbar.service";

@Component({
  selector: "teilnehmer-edit.component",
  templateUrl: './teilnehmer-edit.component.html',
  styleUrls: ['./teilnehmer-edit.component.css']
})

export class TeilnehmerEditComponent implements OnInit {
  title: string;
  myTeilnehmer: Teilnehmer;
  editMode: boolean;
  form: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder,
              public nav: NavbarService,
              @Inject('BASE_URL') private baseUrl: string) {

    // leeres Aktivität-Objekt erstellen
    this.myTeilnehmer = <Teilnehmer>{};

    // initialize the form
    this.createForm();

    let id = +this.activatedRoute.snapshot.params["id"];  // Id der Gruppe
    // check if we're in edit mode or not
    this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

    if (this.editMode) {
      // fetch the quiz from the server
      let url = this.baseUrl + "api/teilnehmer/" + id;
      this.http.get<Teilnehmer>(url).subscribe(res => {
        this.myTeilnehmer = res;
        this.title = "Edit - " + this.myTeilnehmer.Vorname || this.myTeilnehmer.Nachname;

        // update the form with the quiz value
        this.updateForm();
      }, error => console.error(error));
    }
    else {
      this.myTeilnehmer.GruppenId = id;
      this.title = "Erstelle neuen Teilnehmer";
    }
  }

  ngOnInit() {
    this.nav.hide();
  }

  onSubmit() {
    // build a temporary quiz object from form values
    var tempTeilnehmer = <Teilnehmer>{};
    tempTeilnehmer.Vorname = this.form.value.Vorname;
    tempTeilnehmer.Nachname = this.form.value.Nachname;
    tempTeilnehmer.GruppenId = this.myTeilnehmer.GruppenId;

    let url = this.baseUrl + "api/teilnehmer";
    if (this.editMode) {
      tempTeilnehmer.Id = this.myTeilnehmer.Id;
      this.http
        .post<Teilnehmer>(url, tempTeilnehmer)
        .subscribe(res => {
          this.myTeilnehmer = res;
          console.log("Teilnehmer " + this.myTeilnehmer.Id + " wurde mutiert.");
          //this.router.navigate(["home"]);
          this.router.navigate(["gruppen/edit", this.myTeilnehmer.GruppenId]);
        }, error => console.log(error));
    }
    else {
      this.http
        .put<Teilnehmer>(url, tempTeilnehmer)
        .subscribe(res => {
          var q = res;
          console.log("Teilnehmer " + q.Id + " erstellt.");
          //this.router.navigate(["home"]);
          this.router.navigate(["gruppen/edit", this.myTeilnehmer.GruppenId]);
        }, error => console.log(error));
    }
  }

  onBack() {
    this.router.navigate(["gruppen/edit", this.myTeilnehmer.GruppenId]);
  }

  createForm() {
    this.form = this.fb.group({
      Vorname: ['', Validators.required],
      Nachname: ['', Validators.required]
    });
  }

  updateForm() {
    this.form.setValue({
      Vorname: this.myTeilnehmer.Vorname,
      Nachname: this.myTeilnehmer.Nachname || ''
    });
  }
}
