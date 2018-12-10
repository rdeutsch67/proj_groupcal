import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "gruppe-edit",
  templateUrl: './gruppe-edit.component.html',
  styleUrls: ['./gruppe-edit.component.css']
})

export class GruppeEditComponent {
  code: string;
  gruppe: Gruppe;
  form: FormGroup;
  editMode: boolean;  // this will be TRUE when editing an existing quiz,
                      // FALSE when creating a new one.

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder,
              @Inject('BASE_URL') private baseUrl: string) {

    // create an empty object from the Gruppe interface
    this.gruppe = <Gruppe>{};

    // initialize the form
    this.createForm();

    var id = +this.activatedRoute.snapshot.params["id"];
    if (id) {
      this.editMode = true;

      // fetch the gruppe from the server
      var url = this.baseUrl + "api/gruppen/" + id;
      this.http.get<Gruppe>(url).subscribe(res => {
        this.gruppe = res;
        this.code = "Edit - " + this.gruppe.Code;
        // update the form with the quiz value
        this.updateForm();
      }, error => console.error(error));
    }
    else {
      this.editMode = false;
      this.code = "Erstelle neue Gruppe";
    }
  }

  onSubmit() {
    // build a temporary quiz object from form values
    var tempGruppe = <Gruppe>{};
    tempGruppe.Code = this.form.value.Code;
    tempGruppe.Bezeichnung = this.form.value.Bezeichnung;
    tempGruppe.Beschreibung = this.form.value.Beschreibung;
    tempGruppe.Aktiv = this.form.value.Aktiv;

    var url = this.baseUrl + "api/gruppen";
    if (this.editMode) {
      // don't forget to set the tempGruppe Id,
      // otherwise the EDIT would fail!
      tempGruppe.Id = this.gruppe.Id;
      this.http
        .post<Gruppe>(url, tempGruppe)
        .subscribe(res => {
          this.gruppe = res;
          console.log("Gruppe " + this.gruppe.Id + " wurde mutiert.");
          //this.router.navigate(["home"]);
        }, error => console.log(error));
    }
    else {  // neue Gruppe erstellen
      this.http
        /*.put<Gruppe>(url, this.gruppe)*/
        .put<Gruppe>(url, tempGruppe)
        .subscribe(res => {
          var q = res;
          console.log("Gruppe " + q.Id + " erstellt.");
          this.router.navigate(["gruppen/edit/"+q.Id]);
        }, error => console.log(error));
    }
  }

  onShowPlaner() {
    this.router.navigate(["kalender/"+this.gruppe.Id]);
  }

  onBack() {
    this.router.navigate(["home"]);
  }

  createForm() {
    this.form = this.fb.group({
      Code: ['', Validators.required],
      Bezeichnung: '',
      Beschreibung: '',
      Aktiv: false
    });
  }

  updateForm() {
    this.form.setValue({
      Code: this.gruppe.Code,
      Bezeichnung: this.gruppe.Bezeichnung || '',
      Beschreibung: this.gruppe.Beschreibung || '',
      Aktiv: this.gruppe.Aktiv
    });
  }
}
