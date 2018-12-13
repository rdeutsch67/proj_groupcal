interface Termin {
  Id: number;
  IdGruppe: number;
  IdTeilnehmer: number;
  IdAktivitaet: number;
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
}
