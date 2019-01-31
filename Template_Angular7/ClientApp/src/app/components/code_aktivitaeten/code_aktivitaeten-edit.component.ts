import { Component, Inject, OnInit, OnChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment";

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

  aktZeitBeginn = new Date();
  aktZeitEnde = new Date();

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
        this.aktZeitBeginn = new Date(this.code_aktivitaet.ZeitBeginn);
        this.aktZeitEnde = new Date(this.code_aktivitaet.ZeitEnde);

        // update the form with the quiz value
        this.updateForm();
      }, error => console.error(error));
    }
    else {
      this.code_aktivitaet.GruppenId = id;
      this.title = "Erstelle neue Gruppenaktivität";
    }
  }

  onChangeGanzerTag(event) {
    console.log(event.target.checked);
    let bGanzerTag: boolean = event.target.checked;
    let myZeitBeginn$: string = "";
    let myZeitEnde$: string = "";
    let aDate = new Date();

    aDate = moment(aDate).add(1, 'hours').toDate();  // zur aktuellen Uhrzeit ein Stunde dazu rechnen

    if (bGanzerTag) {
      myZeitBeginn$ = "00:00";
      myZeitEnde$ = "23:59";
    }
    else {
      myZeitBeginn$ = new Date().getHours().toString(10) + ':00';
      myZeitEnde$ = aDate.getHours().toString(10) + ':00';
    }

    this.form.setValue({
      Code: this.form.value.Code,
      Bezeichnung: this.form.value.Bezeichnung || '',
      Farbe: this.form.value.Farbe,
      Summieren: this.form.value.Summieren,
      GanzerTag: this.form.value.GanzerTag,
      ZeitUnbestimmt: false,
      ZeitBeginn: myZeitBeginn$,
      ZeitEnde: myZeitEnde$
    });
  }

  onChangeZeitUnbestimmt(event) {
    console.log(event.target.checked);
    let bZeitUnbestmmt: boolean = event.target.checked;
    let myZeitBeginn$: string = "";
    let myZeitEnde$: string = "";
    let aDate = new Date();

    aDate = moment(aDate).add(1, 'hours').toDate();  // zur aktuellen Uhrzeit ein Stunde dazu rechnen

    if (bZeitUnbestmmt == false) {
      myZeitBeginn$ = new Date().getHours().toString(10) + ':00';
      myZeitEnde$ = aDate.getHours().toString(10) + ':00';
    };

    this.form.setValue({
      Code: this.form.value.Code,
      Bezeichnung: this.form.value.Bezeichnung || '',
      Farbe: this.form.value.Farbe,
      Summieren: this.form.value.Summieren,
      GanzerTag: false,
      ZeitUnbestimmt: this.form.value.ZeitUnbestimmt,
      ZeitBeginn: myZeitBeginn$,
      ZeitEnde: myZeitEnde$
    });
  }

  onSubmit() {
    // build a temporary quiz object from form values
    var tempAkt = <Code_aktivitaet>{};
    tempAkt.Code = this.form.value.Code;
    tempAkt.Bezeichnung = this.form.value.Bezeichnung;
    tempAkt.GruppenId = this.code_aktivitaet.GruppenId;
    tempAkt.Farbe = this.form.value.Farbe;
    tempAkt.Summieren = this.form.value.Summieren;
    tempAkt.GanzerTag = this.form.value.GanzerTag;
    tempAkt.ZeitUnbestimmt = this.form.value.ZeitUnbestimmt;
    if (this.form.value.ZeitBeginn != "") {
      tempAkt.ZeitBeginn = this.form.value.ZeitBeginn;
    }
    if (this.form.value.ZeitEnde != "") {
      tempAkt.ZeitEnde = this.form.value.ZeitEnde;
    }


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
    let aDate = new Date();
    aDate = moment(aDate).add(1, 'hours').toDate();  // zur aktuellen Uhrzeit ein Stunde dazu rechnen
    this.form = this.fb.group({
      Code: ['', Validators.required],
      Bezeichnung: '',
      Farbe: '',
      Summieren: false,
      GanzerTag: false,
      ZeitUnbestimmt: false,
      ZeitBeginn: [new Date().getHours() + ':00'],
      ZeitEnde: [aDate.getHours().toString(10) + ':00']
    });
  }

  updateForm() {
    let myZeitBeginn$: string = "";
    let myZeitEnde$: string = "";
    if (this.code_aktivitaet.ZeitUnbestimmt != true) {
      // hier bei den Zeiten führende Null zufügen, ansonsten wird die Uhrzeit nicht dargestellt
      myZeitBeginn$ = ((this.aktZeitBeginn.getHours() < 10 ? '0' : '') + this.aktZeitBeginn.getHours()) + ':'
      + ((this.aktZeitBeginn.getMinutes() < 10 ? '0' : '') + this.aktZeitBeginn.getMinutes());
        myZeitEnde$ = ((this.aktZeitEnde.getHours() < 10 ? '0' : '') + this.aktZeitEnde.getHours()) + ':'
      + ((this.aktZeitEnde.getMinutes() < 10 ? '0' : '') + this.aktZeitEnde.getMinutes())
    };

    this.form.setValue({
      Code: this.code_aktivitaet.Code,
      Bezeichnung: this.code_aktivitaet.Bezeichnung || '',
      Farbe: this.code_aktivitaet.Farbe,
      Summieren: this.code_aktivitaet.Summieren,
      GanzerTag: this.code_aktivitaet.GanzerTag,
      ZeitUnbestimmt: this.code_aktivitaet.ZeitUnbestimmt,
      ZeitBeginn: myZeitBeginn$,
      ZeitEnde: myZeitEnde$
    });
  }
}
