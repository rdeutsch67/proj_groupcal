using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Template_Angular7.Data
{
    public class CodeAktivitaeten
    {
        #region Constructor
        public CodeAktivitaeten()
        {
        }
        #endregion
        
        #region Properties
        [Key]
        [Required]
        public int Id { get; set; }
        [Required]
        public int GruppenId { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public string Bezeichnung { get; set; }
        [Required]
        public string Farbe { get; set; }
        [DefaultValue(0)]
        public bool Summieren { get; set; }
        
        [Required]
        [DefaultValue(0)]
        public bool GanzerTag { get; set; }
            
        [Required]
        public DateTime ZeitBeginn { get; set; }
        [Required]
        public DateTime ZeitEnde { get; set; }
        
        [Required]
        public DateTime CreatedDate { get; set; }
        [Required]
        public DateTime LastModifiedDate { get; set; }
        #endregion
        
        #region Lazy-Load Properties
        /// <summary>
        /// Codes, welche zur Gruppe gehÃ¶ren
        /// </summary>
        [ForeignKey("GruppenId")]
        public virtual Gruppe Gruppe  { get; set; }
        
        /// <summary>
        /// Termin, welche zum Teilnehmer gehÃ¶ren
        /// </summary>
        public virtual List<Termin> Termine { get; set; }
        #endregion
    }
}