interface Termin {
  Id: number;
  IdTermin: number;
  IdGruppe: number;
  IdTeilnehmer: number;
  IdAktivitaet: number;
  DatumBeginn: Date;
  DatumEnde: Date;
  GanzerTag: boolean;
  Hinweis: string;

  AktFarbe: string;
  AktCode: string;
  AktBezeichnung: string;
  AktSummieren: boolean;

  TnVorname: string;
  TnNachname: string;

  GrpCode: string;
  GrpBezeichnung: string;
}
