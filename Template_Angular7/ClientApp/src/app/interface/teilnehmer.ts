interface Teilnehmer {
  Id: number;
  GruppenId: number;
  Vorname: string;
  Nachname: string;
  Berechtigungen: number;
}

interface VTeilnehmer {
  Id: number;
  GruppenId: number;
  Vorname: string;
  Nachname: string;
  Berechtigungen: number;

  GruppeCode: string;
  GruppeBezeichnung: string;
  GruppeUserId: string;
  GruppeAktiv: boolean;
}



