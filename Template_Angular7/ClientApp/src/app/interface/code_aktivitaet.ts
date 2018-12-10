interface Code_aktivitaet {
  Id: number;
  Code: string;
  Bezeichnung: string;
  GruppenId: number;
  Summieren: boolean;
  Farbe: string;
}

interface VCode_aktivitaet {
  Id: number;
  Code: string;
  Bezeichnung: string;
  GruppenId: number;
  Summieren: boolean;
  Farbe: string;

  GruppeCode: string;
  GruppeBezeichnung: string;
  GruppeUserId: string;
  GruppeAktiv: boolean;
}

