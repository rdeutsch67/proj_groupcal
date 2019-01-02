import {Component, Inject, NgZone, OnChanges, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsDatepickerConfig} from "ngx-bootstrap";
import {PlanerdataService} from "../../services/planerdata.service";
import * as moment from 'moment';
import {NavbarService} from "../../services/navbar.service";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: "termin-edit.component",
  templateUrl: './termin-edit.component.html',
  styleUrls: ['./termin-edit.component.css']
})

export class TerminEditComponent implements OnInit, OnDestroy {
  title: string;
  master: string;
  editMode: boolean;
  newPlanerEvent: boolean;
  showDataJson: boolean = true;
  showDataJsonTitle: string;
  showDebugInfoBtnClass: string;
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

  deviceObserver: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.XSmall]);
  breakpointObserverSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder,
              private loadDataService: PlanerdataService,
              public nav: NavbarService,
              private breakpointObserver: BreakpointObserver,
              @Inject('BASE_URL') private baseUrl: string) {

    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      //value: new Date(2018,10,10),
      dateInputFormat: 'DD.MM.YYYY',
      showWeekNumbers: false
    });

    // create an empty object from the Gruppe interface
    this.myTermin = <Termin>{};

    // init Comboboxinhalte
    this.selGruppen = <Gruppe[]>{};
    this.selTeilnehmer = <Teilnehmer[]>{};
    this.selAktivitaeten = <Code_aktivitaet[]>{};
    this.zzTerminAnzWiederholungen = <ZzTerminAnzWiederholung[]>{};

    loadDataService.loadZzTerminAnzWiederholungen(15).subscribe((data) => {
        this.zzTerminAnzWiederholungen = data;
      }
    );

    // initialize the form
    this.createForm();

    var id = +this.activatedRoute.snapshot.params["id"];
    // check if we're in edit mode or not
    this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");
    this.newPlanerEvent = (this.activatedRoute.snapshot.url[1].path === "new_event");

    if (this.editMode) {
      // Termin holen
      let url = this.baseUrl + "api/termine/" + id;
      this.http.get<Termin>(url).subscribe(res => {
        this.myTermin = res;
        this.title = "Edit - " + id;
        this.master = "(" + this.myTermin.IdTermin + ")";
        this.aktTerminDatBeginn = new Date(this.myTermin.DatumBeginn);
        this.aktTerminDatEnde = new Date(this.myTermin.DatumEnde);
        var url = this.baseUrl + "api/gruppen/" + this.myTermin.IdGruppe;
        this.http.get<Gruppe>(url).subscribe(res => {
          this.selGruppen = Array.of(res);
          loadDataService.loadTeilnehmer(this.myTermin.IdGruppe).subscribe(data => {
              this.selTeilnehmer = data;
              loadDataService.loadAktiviaeten(this.myTermin.IdGruppe).subscribe((data) => {
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

      let myday: Date = this.activatedRoute.snapshot.params["myday"];

      if (myday) {
        this.myTermin.DatumBeginn = new Date(myday);
      }
      else {
        this.myTermin.DatumBeginn = new Date();
      }
      this.myTermin.IdGruppe = id;
      this.myTermin.GanzerTag = false;

      let url = this.baseUrl + "api/gruppen/" + this.myTermin.IdGruppe;
      this.http.get<Gruppe>(url).subscribe(res => {
        this.selGruppen = Array.of(res);
        loadDataService.loadTeilnehmer(this.myTermin.IdGruppe).subscribe((data) => {
            this.selTeilnehmer = data;
            loadDataService.loadAktiviaeten(this.myTermin.IdGruppe).subscribe((data) => {
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

  ngOnInit() {
    this.InitFormFields();

    this.breakpointObserverSubscription = this.deviceObserver
      .subscribe(state => {
        if (state.matches) {
          console.log('Viewport is 500px or over!');
          this.nav.hide();
        } else {
          console.log('Viewport is getting smaller!');
          this.nav.show();
        }
      });
  }

  ngOnDestroy() {
    this.breakpointObserverSubscription.unsubscribe();
  }

  InitFormFields() {
    this.form = this.fb.group({
      DatumBeginn: new Date(),
      DatumEnde: '',
      GanzerTag: false,
      ZeitBeginn: "10:00",
      ZeitEnde: "11:00",
      AnzWiederholungen: '',
      MoWH: false, DiWH: false, MiWH: false, DoWH: false, FrWH: false, SaWH: false, SoWH: false,
      IdGruppe: '',
      IdTeilnehmer: '',
      IdAktivitaet: '',
      Hinweis: ''
    });
  }

  onChangeDatumBeginn(value: Date): void {
    let dtBeginn: Date = new Date(value);
    let dtEnde: Date = new Date(this.form.value.DatumEnde);
    if (moment(dtEnde, "DD.MM.YYYY") < moment(dtBeginn, "DD.MM.YYYY")) {
      this.form.patchValue(
        {
          DatumEnde: dtBeginn
        }
      );
    }
  }

  onChangeGruppe(newValue) {
    console.log(newValue);
    this.selectedGruppe = newValue;
    this.loadDataService.loadTeilnehmer(newValue).subscribe((data) => {
        this.selTeilnehmer = data;
        this.loadDataService.loadAktiviaeten(newValue).subscribe((data) => {
            this.selAktivitaeten = data;
          }
        )
      }
    );
  }

  onChangeAktivitaet(newValue, callOverride?: boolean, newGanzerTag?: boolean) {
    console.log(newValue);
    this.selectedAktivitaet = newValue;

    var selAktivitaet: Code_aktivitaet[];
    selAktivitaet = <Code_aktivitaet[]>{};
    selAktivitaet = this.selAktivitaeten.filter(x => x.Id == this.selectedAktivitaet);

    if ((selAktivitaet[0].GanzerTag == true) || (newGanzerTag == true)) {
      myZeitBeginn$ = "00:00";
      myZeitEnde$ = "23:59";
    }
    else {
      // Zeiten gemäss Codedefinition anzeigen
      if (!selAktivitaet[0].ZeitUnbestimmt) {
        var myZeitBeginn: Date = new Date(selAktivitaet[0].ZeitBeginn);
        var myZeitBeginn$ = ((myZeitBeginn.getHours() < 10 ? '0' : '') + myZeitBeginn.getHours()) + ':'
          + ((myZeitBeginn.getMinutes() < 10 ? '0' : '') + myZeitBeginn.getMinutes());
        var myZeitEnde: Date = new Date(selAktivitaet[0].ZeitEnde);
        var myZeitEnde$ = ((myZeitEnde.getHours() < 10 ? '0' : '') + myZeitEnde.getHours()) + ':'
          + ((myZeitEnde.getMinutes() < 10 ? '0' : '') + myZeitEnde.getMinutes());
      }
      else {
        let aDate = new Date();
        aDate = moment(aDate).add(1, 'hours').toDate();  // zur aktuellen Uhrzeit ein Stunde dazu rechnen
        myZeitBeginn$ = new Date().getHours().toString(10) + ':00';
        myZeitEnde$ = new Date(aDate).getHours().toString(10) + ':00';
      }

    }

    if (callOverride) {
      this.form.patchValue(
        {
          GanzerTag: newGanzerTag,
          ZeitBeginn: myZeitBeginn$,
          ZeitEnde: myZeitEnde$,
        }
      );
    }
    else {
      this.form.patchValue(
        {
          GanzerTag: selAktivitaet[0].GanzerTag,
          ZeitBeginn: myZeitBeginn$,
          ZeitEnde: myZeitEnde$,
        }
      );
    }
  }

  onClickGanzerTag(e) {
    this.selGanzerTag = e.target.checked;
    this.onChangeAktivitaet(this.form.value.IdAktivitaet, true, this.selGanzerTag);
  }

  onSubmit() {

    let FlagWHMo: boolean;
    let FlagWHDi: boolean;
    let FlagWHMi: boolean;
    let FlagWHDo: boolean;
    let FlagWHFr: boolean;
    let FlagWHSa: boolean;
    let FlagWHSo: boolean;

    function GetNextDay(myDate: Date, dayINeed: number): Date {
      // if we haven't yet passed the day of the week that I need:
      if (moment(myDate).isoWeekday() < dayINeed) {
        // then just give me this week's instance of that day
        return moment(myDate).isoWeekday(dayINeed).toDate();
      } else {
        // otherwise, give me next week's instance of that day
        return moment(myDate).add(1, 'weeks').isoWeekday(dayINeed).toDate();
      }
    }

    function HandleWiederholungen(myHttp: HttpClient) {

      let arrNxtWochentag: Date[] = [];
      // die nächsten Tagesdaten der gewählten Wochentage ermitteln (z.B. welches Datum hat der nächste Montag vom gewählten Startdatum aus gesehen)
      if (FlagWHMo == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 1))
      }
      ;
      if (FlagWHDi == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 2))
      }
      ;
      if (FlagWHMi == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 3))
      }
      ;
      if (FlagWHDo == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 4))
      }
      ;
      if (FlagWHFr == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 5))
      }
      ;
      if (FlagWHSa == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 6))
      }
      ;
      if (FlagWHSo == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 7))
      }
      ;

      // Differenz vom Ende- zum Startdatum ermitteln
      let startdate = moment(tempTermin.DatumBeginn, "DD.MM.YYYY");
      let enddate = moment(tempTermin.DatumEnde, "DD.MM.YYYY");
      let daydiff: number = enddate.diff(startdate, 'days');

      // gemäss Anzahl Wiederholungen die Start- und Endedaten berechnen und in die Termine einfügen
      if (AnzahlWH > 0) {
        for (let d = 0; d <= arrNxtWochentag.length - 1; d++) {
          for (let i = 0; i <= AnzahlWH - 1; i++) {
            // DatumBeginn
            let DatumBeginnWH: Date = new Date(arrNxtWochentag[d]);
            DatumBeginnWH.setDate(DatumBeginnWH.getDate() + (7 * i));
            let curDatumBeginn: Date = new Date(tempTermin.DatumBeginn);
            tempTermin.DatumBeginn = new Date(DatumBeginnWH.getFullYear(), DatumBeginnWH.getMonth(), DatumBeginnWH.getDate(),
              curDatumBeginn.getHours(), curDatumBeginn.getMinutes(), curDatumBeginn.getSeconds(), curDatumBeginn.getMilliseconds());
            // DatumEnde
            let DatumEndeWH: Date = new Date(tempTermin.DatumBeginn);
            DatumEndeWH.setDate(tempTermin.DatumBeginn.getDate() + daydiff);
            let curDatumEnde: Date = new Date(tempTermin.DatumEnde);
            tempTermin.DatumEnde = new Date(DatumEndeWH.getFullYear(), DatumEndeWH.getMonth(), DatumEndeWH.getDate(),
              curDatumEnde.getHours(), curDatumEnde.getMinutes(), curDatumEnde.getSeconds(), curDatumEnde.getMilliseconds());

            tempTermin.IdTermin = myIdMaster;
            myHttp
              .put<Termin>(url, tempTermin)
              .subscribe(res => {
                let q = res;
                console.log("Termin " + q.Id + " erstellt.");
              }, error => console.log(error));
          }
        }
      }
    }

    FlagWHMo = this.form.value.MoWH;
    FlagWHDi = this.form.value.DiWH;
    FlagWHMi = this.form.value.MiWH;
    FlagWHDo = this.form.value.DoWH;
    FlagWHFr = this.form.value.FrWH;
    FlagWHSa = this.form.value.SaWH;
    FlagWHSo = this.form.value.SoWH;

    let AnzahlWH: number = this.form.value.AnzWiederholungen;
    let WiederholungenVorhanden: boolean = (FlagWHMo || FlagWHDi || FlagWHMi || FlagWHDo || FlagWHFr || FlagWHSa || FlagWHSo) && (AnzahlWH > 0);

    // build a temporary termin object from form values
    let tempTermin = <Termin>{};

    tempTermin.GanzerTag = this.form.value.GanzerTag;
    let myIdMaster: number = 0;
    let myBeginnDate: Date = new Date(this.form.value.DatumBeginn);
    let myEndeDate: Date = new Date(this.form.value.DatumEnde);
    if (tempTermin.GanzerTag == true) {
      // Beginn
      myBeginnDate.setHours(0, 0, 0, 0);
      // Ende
      myEndeDate.setHours(23, 59, 59, 999);
    }
    else {
      // Beginn
      var myZeit: string = this.form.value.ZeitBeginn;           // hier ein Zeitstring z.B. "21:15" zurückgegeben
      var myHour = parseInt(myZeit.substring(0, 2), 10);
      var myMinutes = parseInt(myZeit.substring(3, 5), 10);
      myBeginnDate.setHours(myHour, myMinutes, 0, 0);
      // Ende
      myZeit = this.form.value.ZeitEnde;
      myHour = parseInt(myZeit.substring(0, 2), 10);
      myMinutes = parseInt(myZeit.substring(3, 5), 10);
      myEndeDate.setHours(myHour, myMinutes, 0, 0);
    }

    tempTermin.DatumBeginn = myBeginnDate;
    tempTermin.DatumEnde = myEndeDate;
    tempTermin.IdGruppe = this.form.value.IdGruppe;
    tempTermin.IdTeilnehmer = this.form.value.IdTeilnehmer;
    tempTermin.IdAktivitaet = this.form.value.IdAktivitaet;
    tempTermin.Hinweis = this.form.value.Hinweis;

    var url = this.baseUrl + "api/termine";
    if (this.editMode) {
      // don't forget to set the Id,
      // otherwise the EDIT would fail!
      tempTermin.Id = this.myTermin.Id;
      if (WiederholungenVorhanden) {
        tempTermin.IdTermin = tempTermin.Id
      }
      ;
      this.http
        .post<Termin>(url, tempTermin)
        .subscribe(res => {
          this.myTermin = res;
          console.log("Termin " + this.myTermin.Id + " wurde mutiert.");
          myIdMaster = this.myTermin.Id;
          if (WiederholungenVorhanden) {
            let WKok = HandleWiederholungen(this.http);
            console.log("Wiederholungstermine mit IdMaster = " + this.myTermin.Id + " erstellt.");
          }
          ;

          this.router.navigate(["gruppen/edit/" + this.myTermin.IdGruppe]);
        }, error => console.log(error));
    }
    else {  // neuen Termin erstellen
      this.http
        .put<Termin>(url, tempTermin)
        .subscribe(res => {
          var q = res;
          console.log("Termin " + q.Id + " erstellt.");
          myIdMaster = q.Id;
          if (WiederholungenVorhanden) {
            let WKok = HandleWiederholungen(this.http);
            console.log("Wiederholungstermine mit IdMaster = " + q.Id + " erstellt.");

            // zum Schluss die IdTermin vom "Master"-Termin aktualisieren
            q.IdTermin = q.Id;
            this.http
              .post<Termin>(url, q)
              .subscribe(res => {
                q = res;
                console.log("Termin " + q.Id + " wurde mit IdTermin " + q.Id + " aktualisiert.");
              }, error => console.log(error));
          }
          ;
          if (!WiederholungenVorhanden) {
            this.router.navigate(["gruppen/edit/" + q.IdGruppe]);
          }
        }, error => console.log(error));

    }
  }

  onBack() {
    this.router.navigate(["gruppen/edit", this.myTermin.IdGruppe]);
  }

  createForm() {
    this.InitFormFields();
    this.onShowDataJson('');
  }

  updateForm() {
    if (this.editMode) {
      this.form.setValue({
        DatumBeginn: this.aktTerminDatBeginn,
        DatumEnde: this.aktTerminDatEnde,
        GanzerTag: this.myTermin.GanzerTag,
        ZeitBeginn: ((this.aktTerminDatBeginn.getHours() < 10 ? '0' : '') + this.aktTerminDatBeginn.getHours()) + ':'
          + ((this.aktTerminDatBeginn.getMinutes() < 10 ? '0' : '') + this.aktTerminDatBeginn.getMinutes()),
        ZeitEnde: ((this.aktTerminDatEnde.getHours() < 10 ? '0' : '') + this.aktTerminDatEnde.getHours()) + ':'
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
      let aDate = new Date();
      aDate = moment(aDate).add(1, 'hours').toDate();  // zur aktuellen Uhrzeit ein Stunde dazu rechnen
      this.form.setValue({
        DatumBeginn: this.myTermin.DatumBeginn,
        DatumEnde: this.myTermin.DatumBeginn,
        GanzerTag: this.myTermin.GanzerTag,
        ZeitBeginn: [new Date().getHours() + ':00'],
        ZeitEnde: [aDate.getHours().toString(10) + ':00'],
        AnzWiederholungen: 0,
        MoWH: false, DiWH: false, MiWH: false, DoWH: false, FrWH: false, SaWH: false, SoWH: false,
        IdGruppe: this.myTermin.IdGruppe,
        IdTeilnehmer: '',
        IdAktivitaet: '',
        Hinweis: ''
      });
    }
  }

  onShowDataJson($element) {

    function gotoAnchor() {
      setTimeout(function () {
        let element = document.getElementById($element);
        element.scrollIntoView({behavior: "smooth", block: "nearest"})
      }, 0)
    }

    function gobackToTop() {
      setTimeout(function () {
        let element = document.getElementById($element);
        element.scrollIntoView({behavior: "smooth", block: "start"})
      }, 0)
    }

    this.showDataJson = !this.showDataJson;
    if (this.showDataJson) {
      this.showDataJsonTitle = 'Debug-Info';
      this.showDebugInfoBtnClass = 'btn btn-sm btn-warning';
      this.showDataJsonBtnIcon = 'fas fa-arrow-circle-up';
      if ($element != "") {
        gotoAnchor();
      }
    }
    else {
      this.showDataJsonTitle = 'Debug-Info';
      this.showDebugInfoBtnClass = 'btn btn-sm btn-primary';
      this.showDataJsonBtnIcon = 'fas fa-arrow-circle-down';
      if ($element != "") {
        gobackToTop();
      }
    }
  }


}
