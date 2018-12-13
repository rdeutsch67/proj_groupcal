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
  title: string;
  editMode: boolean;
  newPlanerEvent: boolean;
  showDataJson: boolean = true;
  showDataJsonTitle: string;
  showDataJsonBtnClass: string;
  showDataJsonBtnIcon: string;
  myTermin: Termin;

  aktTerminDatBeginn = new Date();
  aktTerminDatEnde = new Date();
  /*aktTerminZeitBeginn = new Date();
  aktTerminZeitEnde = new Date();*/
  form: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig>;
  bsValue = new Date();
  // Auswahlboxen
  selGruppen: Gruppe[];
  selectedGruppe: number;
  selTeilnehmer: Teilnehmer[];
  selAktivitaeten: Code_aktivitaet[];

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
      this.myTermin.DatumBeginn = new Date();
      this.myTermin.IdGruppe = id;

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

  onSubmit() {
    // build a temporary termin object from form values
    var tempTermin = <Termin>{};
    var myBeginnDate: Date = new Date(this.form.value.DatumBeginn);
    var myZeit: string = this.form.value.ZeitBeginn;           // hier ein Zeitstring z.B. "21:15" zurückgegeben
    var myHour = parseInt(myZeit.substring(0,2),10);
    var myMinutes = parseInt(myZeit.substring(3,5),10);
    myBeginnDate.setHours(myHour,myMinutes,0,0);
    tempTermin.DatumBeginn = myBeginnDate;

    var myEndeDate: Date = new Date(this.form.value.DatumEnde);
    var myZeit: string = this.form.value.ZeitEnde;
    var myHour = parseInt(myZeit.substring(0,2),10);
    var myMinutes = parseInt(myZeit.substring(3,5),10);
    myEndeDate.setHours(myHour,myMinutes,0,0);
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
      ZeitBeginn: '',
      ZeitEnde: '',
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
      ZeitBeginn: '',
      ZeitEnde: '',
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
        ZeitBeginn: ((this.aktTerminDatBeginn.getHours() < 10 ? '0' : '') + this.aktTerminDatBeginn.getHours()) + ':'
          + ((this.aktTerminDatBeginn.getMinutes() < 10 ? '0' : '') + this.aktTerminDatBeginn.getMinutes()),
        ZeitEnde:   ((this.aktTerminDatEnde.getHours() < 10 ? '0' : '') + this.aktTerminDatEnde.getHours()) + ':'
          + ((this.aktTerminDatEnde.getMinutes() < 10 ? '0' : '') + this.aktTerminDatEnde.getMinutes()),
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
        ZeitBeginn: ((this.myTermin.DatumBeginn.getHours() < 10 ? '0' : '') + this.myTermin.DatumBeginn.getHours()) + ':'
          + ((this.myTermin.DatumBeginn.getMinutes() < 10 ? '0' : '') + this.myTermin.DatumBeginn.getMinutes()),
        ZeitEnde:   ((this.myTermin.DatumBeginn.getHours() < 10 ? '0' : '') + this.myTermin.DatumBeginn.getHours()) + ':'
          + ((this.myTermin.DatumBeginn.getMinutes() < 10 ? '0' : '') + this.myTermin.DatumBeginn.getMinutes()),
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
