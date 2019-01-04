import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {HomeComponent} from './home/home.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BsDatepickerModule} from "ngx-bootstrap";

import {LOCALE_ID} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeDECH from '@angular/common/locales/de-CH';


import {GruppenListeComponent} from "./components/gruppe/gruppen-liste.component";
//import {GruppeComponent} from "./components/gruppe/gruppe.component";
import {AboutComponent} from "./components/about/about.component";
import {PageNotFoundComponent} from "./components/pagenotfound.component/pagenotfound.component";
import {GruppeEditComponent} from "./components/gruppe/gruppe-edit.component";
import {Code_aktivitaetenEditComponent} from "./components/code_aktivitaeten/code_aktivitaeten-edit.component";
import {Code_aktivitaetenListeComponent} from "./components/code_aktivitaeten/code_aktivitaeten-liste.component";
import {TeilnehmerListeComponent} from "./components/teilnehmer/teilnehmer-liste.component";
import {TeilnehmerEditComponent} from "./components/teilnehmer/teilnehmer-edit.component";
import {TerminEditComponent} from "./components/termin/termin-edit.component";
import {TerminListeComponent} from "./components/termin/termin-liste.component";
import {PlanerdataService} from "./services/planerdata.service";
import {KalenderComponent} from "./components/kalender/kalender.component";
import {FlatpickrModule} from 'angularx-flatpickr';
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxJsonViewerModule} from "ngx-json-viewer";
import {NavbarService} from "./services/navbar.service";
import { LayoutModule } from '@angular/cdk/layout';
import {GlobalVariables} from "./global.variables";
//import {ResizeService} from "./services/resize.service";


registerLocaleData(localeDECH);

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    GruppenListeComponent,
    GruppeEditComponent,
    Code_aktivitaetenEditComponent,
    Code_aktivitaetenListeComponent,
    TeilnehmerListeComponent,
    TeilnehmerEditComponent,
    TerminEditComponent,
    TerminListeComponent,
    KalenderComponent,
    AboutComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    LayoutModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxJsonViewerModule,
    BsDatepickerModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      }
    ),
    RouterModule.forRoot([
        {path: '', redirectTo: 'home', pathMatch: 'full'},
        {path: 'home', component: GruppenListeComponent},
        {path: 'gruppen/alle/:count', component: GruppenListeComponent},
        {path: 'gruppen/create', component: GruppeEditComponent},
        {path: 'gruppen/edit/:id', component: GruppeEditComponent},
        {path: 'codesaktivitaeten/vaktivitaeten/:id', component: Code_aktivitaetenListeComponent}, // alle Codes zur Gruppe
        {path: 'codesaktivitaeten/create/:id', component: Code_aktivitaetenEditComponent},
        {path: 'codesaktivitaeten/edit/:id', component: Code_aktivitaetenEditComponent},
        {path: 'codesaktivitaeten/vaktivitaeten/0', component: Code_aktivitaetenListeComponent}, // alle Codes anzeigen
        {path: 'teilnehmer/alle/:id', component: TeilnehmerListeComponent},
        {path: 'teilnehmer/vteilnehmer/:id', component: TeilnehmerListeComponent},
        {path: 'teilnehmer/create/:id', component: TeilnehmerEditComponent},
        {path: 'teilnehmer/edit/:id', component: TeilnehmerEditComponent},
        {path: 'termine/vtermine/:id', component: TerminListeComponent},
        {path: 'termine/create/:id', component: TerminEditComponent},
        {path: 'termine/new_event', component: TerminEditComponent, data: {id: 0, myday: new Date()}},
        {path: 'termine/edit/:id', component: TerminEditComponent},
        {path: 'kalender/:id', component: KalenderComponent},
        {path: 'about', component: AboutComponent},
        {path: '**', component: PageNotFoundComponent}
      ],
      {anchorScrolling: 'enabled'})
  ],
  providers: [
    PlanerdataService,
    NavbarService,
    //ResizeService,
    GlobalVariables, // als Singleton benutzer, dh. bei keiner anderen Komponente zusätzlich als Provider eintragen! (Grund: diese Variablen werden u.U. von anderen Komponenten verändert)
    {provide: LOCALE_ID, useValue: 'de-ch'}],
  bootstrap: [AppComponent]
})

export class AppModule {
}
