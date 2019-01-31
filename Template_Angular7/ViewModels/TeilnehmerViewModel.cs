using Newtonsoft.Json;
using System;

namespace Template_Angular7.ViewModels
{
    [JsonObject(MemberSerialization.OptOut)]
    public class TeilnehmerViewModel
    {
        #region Constructor
        public TeilnehmerViewModel()
        {
        }
        #endregion
        
        #region Properties
        public int Id { get; set; }
        public int GruppenId { get; set; }
        public string Vorname { get; set; }               
        public string Nachname { get; set; }
        public int Berechtigungen { get; set; }
        
        // Gruppeninfo
        public string GruppeCode { get; set; }
        public string GruppeBezeichnung { get; set; }
        public string GruppeUserId { get; set; }
        public bool GruppeAktiv { get; set; }
        
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        #endregion
    }
}

