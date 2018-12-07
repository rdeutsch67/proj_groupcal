using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Template_Angular7.Data
{
    public class Gruppe
    {
        #region Constructor
        public Gruppe()
        {
        }
        #endregion
        
        #region Properties
        [Key]
        [Required]
        public int Id { get; set; }
        
        [Required]
        public string Code { get; set; }
        public string Bezeichnung { get; set; }
        public string Beschreibung { get; set; }
        
        [Required]
        public string UserId { get; set; }
        
        [DefaultValue(0)]
        public bool Aktiv { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        [Required]
        public DateTime LastModifiedDate { get; set; }
        #endregion
        
        #region Lazy-Load Properties
        /// <summary>
        /// Ersteller der Gruppe author: it will be loaded
        /// on first use thanks to the EF Lazy-Loading feature.
        /// </summary>
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
        
        /// <summary>
        /// Liste aller Aktivitätscodes zu dieser Gruppe.
        /// </summary>
        public virtual List<CodeAktivitaeten> CodesAktivitaeten { get; set; }
        
        /// <summary>
        /// Liste aller Teilnehmer zu dieser Gruppe.
        /// </summary>
        public virtual List<Teilnehmer> Teilnehmer { get; set; }
        
        /// <summary>
        /// Liste aller Teilnehmer zu dieser Gruppe.
        /// </summary>
        public virtual List<Termin> Termine { get; set; }
        
        #endregion
    }
}