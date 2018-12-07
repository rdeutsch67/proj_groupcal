using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Template_Angular7.Data
{
    public class Teilnehmer
    {
        #region Constructor
        public Teilnehmer()
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
        public string Vorname { get; set; }
        [Required]
        public string Nachname { get; set; }
        
        [DefaultValue(0)]
        public int Berechtigungen { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        [Required]
        public DateTime LastModifiedDate { get; set; }
        #endregion
        
        #region Lazy-Load Properties
        /// <summary>
        /// Codes, welche zur Gruppe gehören
        /// </summary>
        [ForeignKey("GruppenId")]
        public virtual Gruppe Gruppe  { get; set; }
        
        /// <summary>
        /// Termin, welche zum Teilnehmer gehören
        /// </summary>
        public virtual List<Termin> Termine { get; set; }
        #endregion
    }
}