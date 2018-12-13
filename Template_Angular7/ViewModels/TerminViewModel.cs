using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace Template_Angular7.ViewModels
{
    [JsonObject(MemberSerialization.OptOut)]
    public class TerminViewModel
    {
        #region Constructor
        public TerminViewModel()
        {
        }
        #endregion
        
        #region Properties
        public int Id { get; set; }
        public int IdGruppe { get; set; }
        public int IdTeilnehmer { get; set; }
        public int IdAktivitaet { get; set; }
        public DateTime DatumBeginn { get; set; }
        public DateTime DatumEnde { get; set; }
        public string Hinweis { get; set; }             
        
        public string AktFarbe { get; set; }
        public string AktCode { get; set; }
        public string AktBezeichnung { get; set; }
        public bool AktSummieren { get; set; }
        public DateTime AktZeitBeginn { get; set; }
        public DateTime AktZeitEnde { get; set; }
        
        public string TnVorname { get; set; }
        public string TnNachname { get; set; }
        
        public string GrpCode { get; set; }
        public string GrpBezeichnung { get; set; } 
      
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        #endregion
    }
}
