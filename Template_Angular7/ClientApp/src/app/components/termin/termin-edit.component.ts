import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { BsDatepickerConfig} from "ngx-bootstrap";

@Component({
  selector: "termin-edit.component",
  templateUrl: './termin-edit.component.html',
  styleUrls: ['./termin-edit.component.css']
})

export class TerminEditComponent implements OnInit {
  title: string;
  editMode: boolean;
  termin: Termin;
  aktTerminDat = new Date();
  form: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig>;
  bsValue = new Date();

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder,
              @Inject('BASE_URL') private baseUrl: string) {

    this.datePickerConfig = Object.assign({}, {containerClass: 'theme-dark-blue',
                                                           //value: new Date(2018,10,10),
                                                           dateInputFormat: 'DD.MM.YYYY',
                                                           showWeekNumbers: false});


    // create an empty object from the Gruppe interface
    this.termin = <Termin>{};

    // initialize the form
    //this.createForm();

    var id = +this.activatedRoute.snapshot.params["id"];
    // check if we're in edit mode or not
    this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

    if (this.editMode) {
      // Termin holen
      var url = this.baseUrl + "api/termine/" + id;
      this.http.get<Termin>(url).subscribe(res => {
        this.termin = res;


        //this.aktTerminDat = new Date('August 19, 1975'); // dummy value
        this.aktTerminDat = new Date(this.termin.Datum);

        this.title = "Edit - " + this.termin.Id;
        //this.bsValue = this.termin.Datum;
        // update the form with the quiz value
        this.updateForm();
      }, error => console.error(error));
    }
    else {
      this.editMode = false;
      this.title = "Erstelle neuen Termin";
    }
  }

  onSubmit() {
    // build a temporary termin object from form values
    var tempTermin = <Termin>{};
    tempTermin.Datum = this.form.value.Datum;
    tempTermin.IdGruppe = this.form.value.IdGruppe;
    tempTermin.IdTeilnehmer = this.form.value.IdTeilnehmer;
    tempTermin.IdAktivitaet = this.form.value.IdAktivitaet;
    tempTermin.Hinweis = this.form.value.Hinweis;

    var url = this.baseUrl + "api/termine";
    if (this.editMode) {
      // don't forget to set the Id,
      // otherwise the EDIT would fail!
      tempTermin.Id = this.termin.Id;
      this.http
        .post<Termin>(url, tempTermin)
        .subscribe(res => {
          this.termin = res;
          console.log("Termin " + this.termin.Id + " wurde mutiert.");
          this.router.navigate(["home"]);
        }, error => console.log(error));
    }
    else {  // neuen Termin erstellen
      this.http
        .put<Termin>(url, tempTermin)
        .subscribe(res => {
          var q = res;
          console.log("Termin " + q.Id + " erstellt.");
          this.router.navigate(["termine/edit/"+q.Id]);
        }, error => console.log(error));
    }
  }

  onBack() {
    this.router.navigate(["gruppen/edit", this.termin.IdGruppe]);
  }

  ngOnInit() {
    this.form = this.fb.group({
      Datum: [''],
      IdGruppe: '',
      IdTeilnehmer: '',
      IdAktivitaet: '',
      Hinweis: ''
    });
  }

  /*createForm() {
    this.form = this.fb.group({
      Datum: [''],
      Datum2: [''],
      IdGruppe: '',
      IdTeilnehmer: '',
      IdAktivitaet: '',
      Hinweis: ''
    });
  }*/

  updateForm() {
    this.form.setValue({
      Datum: this.aktTerminDat,
      IdGruppe: this.termin.IdGruppe,
      IdTeilnehmer: this.termin.IdTeilnehmer,
      IdAktivitaet: this.termin.IdAktivitaet,
      Hinweis: this.termin.Hinweis || ''
    });
  }
}
