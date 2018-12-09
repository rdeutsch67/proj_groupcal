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
        public DateTime Datum { get; set; }
        public string Hinweis { get; set; }             
        
        public string Farbe { get; set; }
        public string Code { get; set; }
        public string Bezeichnung { get; set; }
        
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        #endregion
    }
}
