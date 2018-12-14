using Newtonsoft.Json;
using System;

namespace Template_Angular7.ViewModels
{
    [JsonObject(MemberSerialization.OptOut)]
    public class ZzTerminAnzWiederholungenViewModel
    {
        #region Constructor
        public ZzTerminAnzWiederholungenViewModel()
        {
        }
        #endregion
        
        #region Properties
        public int Id { get; set; }
        public int Count { get; set; } 
        public string Bezeichnung { get; set; } 
      
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        #endregion
    }
}
