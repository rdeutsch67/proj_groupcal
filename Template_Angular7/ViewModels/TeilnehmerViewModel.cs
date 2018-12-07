using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

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
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        #endregion
    }
}