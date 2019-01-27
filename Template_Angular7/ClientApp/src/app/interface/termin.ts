interface Termin {
  Id: number;
  IdTermin: number;
  IdGruppe: number;
  IdTeilnehmer: number;
  IdAktivitaet: number;
  GanzerTag: boolean;
  DatumBeginn: Date;
  DatumEnde: Date;

  Hinweis: string;

  AktFarbe: string;
  AktCode: string;
  AktBezeichnung: string;
  AktSummieren: boolean;

  TnVorname: string;
  TnNachname: string;

  GrpCode: string;
  GrpBezeichnung: string;

  CreatedDate: Date;
  LastModifiedDate: Date;
}
