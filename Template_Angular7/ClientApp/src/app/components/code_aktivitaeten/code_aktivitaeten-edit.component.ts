import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: "code_aktivitaeten-edit.component",
  templateUrl: './code_aktivitaeten-edit.component.html',
  styleUrls: ['./code_aktivitaeten-edit.component.css']
})

export class Code_aktivitaetenEditComponent {
  title: string;
  code_aktivitaet: Code_aktivitaet;
  editMode: boolean;
  form: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder,
              @Inject('BASE_URL') private baseUrl: string) {

    // leeres Aktivität-Objekt erstellen
    this.code_aktivitaet = <Code_aktivitaet>{};

    // initialize the form
    this.createForm();

    let id = +this.activatedRoute.snapshot.params["id"];  // Id der Gruppe
    // check if we're in edit mode or not
    this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

    if (this.editMode) {
      // fetch the quiz from the server
      let url = this.baseUrl + "api/codesaktivitaeten/" + id;
      this.http.get<Code_aktivitaet>(url).subscribe(res => {
        this.code_aktivitaet = res;
        this.title = "Edit - " + this.code_aktivitaet.Code;

        // update the form with the quiz value
        this.updateForm();
      }, error => console.error(error));
    }
    else {
      this.code_aktivitaet.GruppenId = id;
      this.title = "Erstelle neue Gruppenaktivität";
    }
  }

  onSubmit() {
    // build a temporary quiz object from form values
    var tempAkt = <Code_aktivitaet>{};
    tempAkt.Code = this.form.value.Code;
    tempAkt.Bezeichnung = this.form.value.Bezeichnung;
    tempAkt.GruppenId = this.code_aktivitaet.GruppenId;
    tempAkt.Farbe = this.form.value.Farbe;

    let url = this.baseUrl + "api/codesaktivitaeten";
    if (this.editMode) {
      tempAkt.Id = this.code_aktivitaet.Id;
      this.http
        .post<Code_aktivitaet>(url, tempAkt)
        .subscribe(res => {
          this.code_aktivitaet = res;
          console.log("Aktivität " + this.code_aktivitaet.Id + " wurde mutiert.");
          //this.router.navigate(["home"]);
          this.router.navigate(["gruppen/edit", this.code_aktivitaet.GruppenId]);
        }, error => console.log(error));
    }
    else {
      this.http
        .put<Code_aktivitaet>(url, tempAkt)
        .subscribe(res => {
          var q = res;
          console.log("Aktivität " + q.Id + " erstellt.");
          //this.router.navigate(["home"]);
          this.router.navigate(["gruppen/edit", this.code_aktivitaet.GruppenId]);
        }, error => console.log(error));
    }
  }

  onBack() {
    this.router.navigate(["gruppen/edit", this.code_aktivitaet.GruppenId]);
  }

  createForm() {
    this.form = this.fb.group({
      Code: ['', Validators.required],
      Bezeichnung: '',
      Farbe: ''
    });
  }

  updateForm() {
    this.form.setValue({
      Code: this.code_aktivitaet.Code,
      Bezeichnung: this.code_aktivitaet.Bezeichnung || '',
      Farbe: this.code_aktivitaet.Farbe
    });
  }
}
