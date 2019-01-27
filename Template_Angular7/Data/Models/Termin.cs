using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Template_Angular7.Data
{
    public class Termin
    {
        #region Constructor
        public Termin()
        {
        }
        #endregion
        
        #region Properties
        [Key]
        [Required]
        public int Id { get; set; }
        [DefaultValue(0)]
        public int IdTermin { get; set; }    // Verbindung auf den ursprünglichen Master-Termin (bei Wiederholungen)
                                             // -> so können z.B. alle diese "gleichartigen" Termine auf einmal mutiert werden
        [Required]
        public int IdGruppe { get; set; }
        [Required]
        public int IdTeilnehmer { get; set; }
        [Required]
        public int IdAktivitaet { get; set; }
        
        [Required]
        [DefaultValue(0)]
        public bool GanzerTag { get; set; }
        
        [Required]
        public DateTime DatumBeginn { get; set; }
        public DateTime DatumEnde { get; set; }
        
        public string Hinweis { get; set; }
        
        [Required]
        public DateTime CreatedDate { get; set; }
        [Required]
        public DateTime LastModifiedDate { get; set; }
        #endregion
        
        #region Lazy-Load Properties
        /// <summary>
        /// Codes, welche zur Gruppe gehören
        /// </summary>
        [ForeignKey("IdGruppe")]
        public virtual Gruppe Gruppe  { get; set; }
        
        [ForeignKey("IdTeilnehmer")]
        public virtual Teilnehmer Teilnehmer  { get; set; }
        
        [ForeignKey("IdAktivitaet")]
        public virtual CodeAktivitaeten CodesAktivitaeten  { get; set; }
        #endregion
    }
}