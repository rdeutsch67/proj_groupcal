using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace Template_Angular7.ViewModels
{
    [JsonObject(MemberSerialization.OptOut)]
    public class CodeAktivitaetenViewModel
    {
        #region Constructor
        public CodeAktivitaetenViewModel()
        {
        }
        #endregion
        
        #region Properties
        public int Id { get; set; }
        public int GruppenId { get; set; }
        public string Code { get; set; }               
        public string Bezeichnung { get; set; }
        public bool Summieren { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        #endregion
    }
}