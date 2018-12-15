import {Component, Inject, OnChanges, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { BsDatepickerConfig} from "ngx-bootstrap";
import {PlanerdataService} from "../../Services/planerdata.service";
import {using} from "rxjs";

@Component({
  selector: "termin-edit.component",
  templateUrl: './termin-edit.component.html',
  styleUrls: ['./termin-edit.component.css']
})

export class TerminEditComponent implements OnInit {
  title: string; master: string;
  editMode: boolean;
  newPlanerEvent: boolean;
  showDataJson: boolean = true;
  showDataJsonTitle: string;
  showDataJsonBtnClass: string;
  showDataJsonBtnIcon: string;
  myTermin: Termin;

  aktTerminDatBeginn = new Date();
  aktTerminDatEnde = new Date();
  selGanzerTag: boolean;
  form: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig>;
  bsValue = new Date();
  // Auswahlboxen
  selGruppen: Gruppe[];
  selectedGruppe: number;
  selectedAktivitaet: number;

  selTeilnehmer: Teilnehmer[];
  selAktivitaeten: Code_aktivitaet[];

  zzTerminAnzWiederholungen: ZzTerminAnzWiederholung[];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder,
              private loadDataService: PlanerdataService,
              @Inject('BASE_URL') private baseUrl: string) {

    this.datePickerConfig = Object.assign({}, {containerClass: 'theme-dark-blue',
                                                           //value: new Date(2018,10,10),
                                                           dateInputFormat: 'DD.MM.YYYY',
                                                           showWeekNumbers: false});

    // create an empty object from the Gruppe interface
    this.myTermin = <Termin>{};

    // init Comboboxinhalte
    this.selGruppen = <Gruppe[]>{};
    this.selTeilnehmer = <Teilnehmer[]>{};
    this.selAktivitaeten = <Code_aktivitaet[]>{};
    this.zzTerminAnzWiederholungen = <ZzTerminAnzWiederholung[]>{};

    loadDataService.loadZzTerminAnzWiederholungen(15).subscribe( (data) => {
        this.zzTerminAnzWiederholungen = data;
      }
    );

    // initialize the form
    this.createForm();

    var id = +this.activatedRoute.snapshot.params["id"];
    // check if we're in edit mode or not
    this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");
    this.newPlanerEvent = (this.activatedRoute.snapshot.url[1].path === "new_event");

    if (this.newPlanerEvent) {
      /*this.heroes$ = this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          // (+) before `params.get()` turns the string into a number
          this.selectedId = +params.get('id');
          return this.service.getHeroes();
        })
      );*/
    }

    if (this.editMode) {
      // Termin holen
      var url = this.baseUrl + "api/termine/" + id;
      this.http.get<Termin>(url).subscribe(res => {
        this.myTermin = res;
        this.title = "Edit - "+id;
        this.master = "("+this.myTermin.IdTermin+")";
        this.aktTerminDatBeginn = new Date(this.myTermin.DatumBeginn);
        this.aktTerminDatEnde = new Date(this.myTermin.DatumEnde);
        var url = this.baseUrl + "api/gruppen/" + this.myTermin.IdGruppe;
        this.http.get<Gruppe>(url).subscribe(res => {
          this.selGruppen = Array.of(res);
          loadDataService.loadTeilnehmer(this.myTermin.IdGruppe).subscribe( data => {
            this.selTeilnehmer = data;
            loadDataService.loadAktiviaeten(this.myTermin.IdGruppe).subscribe( (data) => {
              this.selAktivitaeten = data;
                }
              )
            }
          );
          // update the form with the quiz value
          this.updateForm();
        }, error => console.error(error));
      }, error => console.error(error));
    }
    else {
      this.title = "Erstelle neuen Termin";
      this.master = "";
      this.myTermin.DatumBeginn = new Date();
      this.myTermin.IdGruppe = id;
      this.myTermin.GanzerTag = false;

      let url = this.baseUrl + "api/gruppen/" + this.myTermin.IdGruppe;
      this.http.get<Gruppe>(url).subscribe(res => {
        this.selGruppen = Array.of(res);
        loadDataService.loadTeilnehmer(this.myTermin.IdGruppe).subscribe( (data) => {
          this.selTeilnehmer = data;
          loadDataService.loadAktiviaeten(this.myTermin.IdGruppe).subscribe( (data) => {
            this.selAktivitaeten = data;
              }
            )
          }
        );
        // update the form with the quiz value
        this.updateForm();
      }, error => console.error(error));
      // update the form with the quiz value
      this.updateForm();
    }
  }

  onChangeGruppe(newValue) {
    console.log(newValue);
    this.selectedGruppe = newValue;
    this.loadDataService.loadTeilnehmer(newValue).subscribe( (data) => {
        this.selTeilnehmer = data;
        this.loadDataService.loadAktiviaeten(newValue).subscribe( (data) => {
            this.selAktivitaeten = data;
          }
        )
      }
    );
  }

  onChangeAktivitaet(newValue, orGanzerTag?: boolean, newGanzerTag?: boolean) {
    console.log(newValue);
    this.selectedAktivitaet = newValue;

    var selAktivitaet: Code_aktivitaet[];
    selAktivitaet = <Code_aktivitaet[]>{};
    selAktivitaet =  this.selAktivitaeten.filter(x => x.Id == this.selectedAktivitaet);

    if (!orGanzerTag) {
      if (selAktivitaet[0].GanzerTag == true) {
        myZeitBeginn$ = "00:00";
        myZeitEnde$ = "23:59";
      }
      else {
        // Zeiten gemäss Codedefinition anzeigen
        var myZeitBeginn: Date = new Date(selAktivitaet[0].ZeitBeginn);
        var myZeitBeginn$ = ((myZeitBeginn.getHours() < 10 ? '0' : '') + myZeitBeginn.getHours()) + ':'
          + ((myZeitBeginn.getMinutes() < 10 ? '0' : '') + myZeitBeginn.getMinutes());
        var myZeitEnde: Date = new Date(selAktivitaet[0].ZeitEnde);
        var myZeitEnde$ = ((myZeitEnde.getHours() < 10 ? '0' : '') + myZeitEnde.getHours()) + ':'
          + ((myZeitEnde.getMinutes() < 10 ? '0' : '') + myZeitEnde.getMinutes());
      }
    }
    else {
      if (newGanzerTag == true) {
        myZeitBeginn$ = "00:00";
        myZeitEnde$ = "23:59";
      }
      else {
        // Zeiten gemäss Codedefinition anzeigen
        var myZeitBeginn: Date = new Date(selAktivitaet[0].ZeitBeginn);
        var myZeitBeginn$ = ((myZeitBeginn.getHours() < 10 ? '0' : '') + myZeitBeginn.getHours()) + ':'
          + ((myZeitBeginn.getMinutes() < 10 ? '0' : '') + myZeitBeginn.getMinutes());
        var myZeitEnde: Date = new Date(selAktivitaet[0].ZeitEnde);
        var myZeitEnde$ = ((myZeitEnde.getHours() < 10 ? '0' : '') + myZeitEnde.getHours()) + ':'
          + ((myZeitEnde.getMinutes() < 10 ? '0' : '') + myZeitEnde.getMinutes());
      }
    }

    if (orGanzerTag) {
      this.form.setValue(
        {
          DatumBeginn: this.form.value.DatumBeginn,
          DatumEnde: this.form.value.DatumEnde,
          GanzerTag: newGanzerTag,
          ZeitBeginn: myZeitBeginn$,
          ZeitEnde: myZeitEnde$,
          AnzWiederholungen: this.form.value.AnzWiederholungen,
          MoWH: this.form.value.MoWH, DiWH: this.form.value.DiWH, MiWH: this.form.value.MiWH,
          DoWH: this.form.value.DoWH, FrWH: this.form.value.FrWH, SaWH: this.form.value.SaWH, SoWH: this.form.value.SoWH,
          IdGruppe: this.form.value.IdGruppe,
          IdTeilnehmer: this.form.value.IdTeilnehmer,
          IdAktivitaet: this.form.value.IdAktivitaet,
          Hinweis: this.form.value.Hinweis,
        }
      );
    }
    else {
      this.form.setValue(
        {
          DatumBeginn: this.form.value.DatumBeginn,
          DatumEnde: this.form.value.DatumEnde,
          GanzerTag: selAktivitaet[0].GanzerTag,
          ZeitBeginn: myZeitBeginn$,
          ZeitEnde: myZeitEnde$,
          AnzWiederholungen: this.form.value.AnzWiederholungen,
          MoWH: this.form.value.MoWH, DiWH: this.form.value.DiWH, MiWH: this.form.value.MiWH,
          DoWH: this.form.value.DoWH, FrWH: this.form.value.FrWH, SaWH: this.form.value.SaWH, SoWH: this.form.value.SoWH,
          IdGruppe: this.form.value.IdGruppe,
          IdTeilnehmer: this.form.value.IdTeilnehmer,
          IdAktivitaet: this.form.value.IdAktivitaet,
          Hinweis: this.form.value.Hinweis,
        }
      );
    }

  }

  onClickGanzerTag(e) {
    this.selGanzerTag = e.target.checked;
    this.onChangeAktivitaet(this.form.value.IdAktivitaet, true, this.selGanzerTag);
  }

  onSubmit() {
    // build a temporary termin object from form values
    var tempTermin = <Termin>{};

    tempTermin.GanzerTag = this.form.value.GanzerTag;

    var myBeginnDate: Date = new Date(this.form.value.DatumBeginn);
    var myEndeDate: Date = new Date(this.form.value.DatumEnde);
    if (tempTermin.GanzerTag == true) {
      // Beginn
      myBeginnDate.setHours(0,0,0,0);
      // Ende
      myEndeDate.setHours(23,59,59,999);
    }
    else {
      // Beginn
      var myZeit: string = this.form.value.ZeitBeginn;           // hier ein Zeitstring z.B. "21:15" zurückgegeben
      var myHour = parseInt(myZeit.substring(0,2),10);
      var myMinutes = parseInt(myZeit.substring(3,5),10);
      myBeginnDate.setHours(myHour,myMinutes,0,0);
      // Ende
      myZeit = this.form.value.ZeitEnde;
      myHour = parseInt(myZeit.substring(0,2),10);
      myMinutes = parseInt(myZeit.substring(3,5),10);
      myEndeDate.setHours(myHour,myMinutes,0,0);
    }
    tempTermin.DatumBeginn = myBeginnDate;
    tempTermin.DatumEnde = myEndeDate;
    tempTermin.IdGruppe = this.form.value.IdGruppe;
    tempTermin.IdTeilnehmer = this.form.value.IdTeilnehmer;
    tempTermin.IdAktivitaet = this.form.value.IdAktivitaet;
    tempTermin.Hinweis = this.form.value.Hinweis;

    let FlagWHMo: boolean; FlagWHMo = this.form.value.MoWH;
    let FlagWHDi: boolean; FlagWHDi = this.form.value.DiWH;
    let FlagWHMi: boolean; FlagWHMi = this.form.value.MiWH;
    let FlagWHDo: boolean; FlagWHDo = this.form.value.DoWH;
    let FlagWHFr: boolean; FlagWHFr = this.form.value.FrWH;
    let FlagWHSa: boolean; FlagWHSa = this.form.value.SaWH;
    let FlagWHSo: boolean; FlagWHSo = this.form.value.SoWH;




    var url = this.baseUrl + "api/termine";
    if (this.editMode) {
      // don't forget to set the Id,
      // otherwise the EDIT would fail!
      tempTermin.Id = this.myTermin.Id;
      this.http
        .post<Termin>(url, tempTermin)
        .subscribe(res => {
          this.myTermin = res;
          console.log("Termin " + this.myTermin.Id + " wurde mutiert.");
          this.router.navigate(["gruppen/edit/"+this.myTermin.IdGruppe]);
        }, error => console.log(error));
    }
    else {  // neuen Termin erstellen
      this.http
        .put<Termin>(url, tempTermin)
        .subscribe(res => {
          var q = res;
          console.log("Termin " + q.Id + " erstellt.");
          this.router.navigate(["gruppen/edit/"+q.IdGruppe]);
        }, error => console.log(error));

      if (FlagWHMo || FlagWHDi || FlagWHMi || FlagWHDo || FlagWHFr || FlagWHSa || FlagWHSo ) {
        // Wiederholungen speichern
        let i: number; let DatumBeginnWH, DatumEndeWH: Date;
        let Anzahl: number = this.form.value.AnzWiederholungen;
        if (Anzahl > 0) {
          for (i = 1; i <= Anzahl; i++) {
            DatumBeginnWH = new Date(tempTermin.DatumBeginn);
            DatumBeginnWH.setDate( DatumBeginnWH.getDate() + 7);
            DatumEndeWH = new Date(tempTermin.DatumEnde);
            DatumEndeWH.setDate( DatumEndeWH.getDate() + 7);

            tempTermin.DatumBeginn = DatumBeginnWH;
            tempTermin.DatumEnde = DatumEndeWH;
            this.http
              .put<Termin>(url, tempTermin)
              .subscribe(res => {
                var q = res;
                console.log("Termin " + q.Id + " erstellt.");
                this.router.navigate(["gruppen/edit/"+q.IdGruppe]);
              }, error => console.log(error));
          }
        }
      }
    }
  }

  onBack() {
    this.router.navigate(["gruppen/edit", this.myTermin.IdGruppe]);
  }

  loadGruppen(id: number) {
    let myUrl: string;
    myUrl = this.baseUrl + "api/gruppen/alle/0";  // alle holen
    this.http.get<Gruppe[]>(myUrl).subscribe(res => {
        this.selGruppen = res;
      },
      error => console.error(error));
  }

  ngOnInit() {
    this.form = this.fb.group({
      DatumBeginn: new Date(),
      DatumEnde: '',
      GanzerTag: false,
      ZeitBeginn: '',
      ZeitEnde: '',
      AnzWiederholungen: '',
      MoWH: false, DiWH: false, MiWH: false, DoWH: false, FrWH: false, SaWH: false, SoWH: false,
      IdGruppe: '',
      IdTeilnehmer: '',
      IdAktivitaet: '',
      Hinweis: ''
    });
  }

  createForm() {
    this.form = this.fb.group({
      DatumBeginn: new Date(),
      DatumEnde: '',
      GanzerTag: false,
      ZeitBeginn: '',
      ZeitEnde: '',
      AnzWiederholungen: '',
      MoWH: false, DiWH: false, MiWH: false, DoWH: false, FrWH: false, SaWH: false, SoWH: false,
      IdGruppe: '',
      IdTeilnehmer: '',
      IdAktivitaet: '',
      Hinweis: ''
    });
    this.onShowDataJson();
  }

  updateForm() {
    if (this.editMode) {
      this.form.setValue({
        DatumBeginn: this.aktTerminDatBeginn,
        DatumEnde: this.aktTerminDatEnde,
        GanzerTag: this.myTermin.GanzerTag,
        ZeitBeginn: ((this.aktTerminDatBeginn.getHours() < 10 ? '0' : '') + this.aktTerminDatBeginn.getHours()) + ':'
          + ((this.aktTerminDatBeginn.getMinutes() < 10 ? '0' : '') + this.aktTerminDatBeginn.getMinutes()),
        ZeitEnde:   ((this.aktTerminDatEnde.getHours() < 10 ? '0' : '') + this.aktTerminDatEnde.getHours()) + ':'
          + ((this.aktTerminDatEnde.getMinutes() < 10 ? '0' : '') + this.aktTerminDatEnde.getMinutes()),
        AnzWiederholungen: 0,
        MoWH: false, DiWH: false, MiWH: false, DoWH: false, FrWH: false, SaWH: false, SoWH: false,
        IdGruppe: this.myTermin.IdGruppe,
        IdTeilnehmer: this.myTermin.IdTeilnehmer,
        IdAktivitaet: this.myTermin.IdAktivitaet,
        Hinweis: this.myTermin.Hinweis || ''
      });
    }
    else {
      this.form.setValue({
        DatumBeginn: this.myTermin.DatumBeginn,
        DatumEnde: this.myTermin.DatumBeginn,
        GanzerTag: this.myTermin.GanzerTag,
        ZeitBeginn: "00:00",
        ZeitEnde: "23:59",
        AnzWiederholungen: 0,
        MoWH: false, DiWH: false, MiWH: false, DoWH: false, FrWH: false, SaWH: false, SoWH: false,
        IdGruppe: this.myTermin.IdGruppe,
        IdTeilnehmer: '',
        IdAktivitaet: '',
        Hinweis: ''
      });
    }
  }

  onShowDataJson() {
    this.showDataJson = !this.showDataJson;
    if (this.showDataJson){
      this.showDataJsonTitle = 'JSON-Daten verbergen'
      this.showDataJsonBtnClass = 'btn btn-sm btn-warning';
      this.showDataJsonBtnIcon = 'fas fa-arrow-circle-up';
    }
    else {
      this.showDataJsonTitle = 'JSON-Daten anzeigen'
      this.showDataJsonBtnClass = 'btn btn-sm btn-primary';
      this.showDataJsonBtnIcon = 'fas fa-arrow-circle-down';
    }
  }
}
