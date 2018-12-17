using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Template_Angular7.ViewModels;
using System.Collections.Generic;
using System.Linq;
using Template_Angular7.Data;
using Template_Angular7.Controllers;
using Mapster;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace Template_Angular7.Controllers
{
    [Route("api/[controller]")]
    public class TermineController : BaseApiController
    {
        #region Constructor
        public TermineController(ApplicationDbContext context): base(context) { }
        #endregion Constructor
        
        #region RESTful conventions methods
        /// <summary>
        /// GET: api/termine/{id}
        /// Retrieves the Termin with the given {id}
        /// </summary>
        /// <param name="id">The ID of an existing Termin</param>
        /// <returns>the Aktivität with the given {id}</returns>
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var termin = DbContext.Termine.FirstOrDefault(i => i.Id == id);
            
            // handle requests asking for non-existing quizzes
            if (termin == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Termin ID {0} nicht gefunden", id)
                });
            }
            
            return new JsonResult(
                termin.Adapt<TerminViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// neuen Termin in die DB eintragen
        /// </summary>
        /// <param name="model">The TerminViewModel containing the data to insert</param>
        [HttpPut]
        public IActionResult Put([FromBody]TerminViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);
            
            // handle the insert (without object-mapping)
            var termin = new Termin();
            
            // properties taken from the request
            termin.IdTermin = model.IdTermin;
            termin.IdGruppe = model.IdGruppe;
            termin.IdTeilnehmer = model.IdTeilnehmer;
            termin.IdAktivitaet = model.IdAktivitaet;
            termin.GanzerTag = model.GanzerTag;
            termin.DatumBeginn = model.DatumBeginn.ToLocalTime();
            termin.DatumEnde = model.DatumEnde.ToLocalTime();
            termin.Hinweis = model.Hinweis;
            
            // properties set from server-side
            termin.CreatedDate = DateTime.Now;
            termin.LastModifiedDate = termin.CreatedDate;
            // add the new quiz
            DbContext.Termine.Add(termin);
            // persist the changes into the Database.
            DbContext.SaveChanges();
            // return the newly-created Quiz to the client.
            return new JsonResult(termin.Adapt<TerminViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// Termin anhand der {id} editieren
        /// </summary>
        /// <param name="model">The TerminViewModel containing the data to update</param>
        [HttpPost]
        public IActionResult Post([FromBody]TerminViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);
            
            // Termin holen 
            var termin = DbContext.Termine.Where(q => q.Id == model.Id).FirstOrDefault();
            
            // handle requests asking for non-existing quizzes
            if (termin == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Termin ID {0} nicht gefunden.", model.Id)
                });
            }
            
            // handle the update (without object-mapping)
            // by manually assigning the properties
            // we want to accept from the request
            termin.IdTermin = model.IdTermin;
            termin.IdGruppe = model.IdGruppe;
            termin.IdTeilnehmer = model.IdTeilnehmer;
            termin.IdAktivitaet = model.IdAktivitaet;
            termin.GanzerTag = model.GanzerTag;
            termin.DatumBeginn = model.DatumBeginn.ToLocalTime();
            termin.DatumEnde = model.DatumEnde.ToLocalTime();
            termin.Hinweis = model.Hinweis;
            
            // properties set from server-side
            termin.LastModifiedDate = termin.CreatedDate;
            
            // persist the changes into the Database.
            DbContext.SaveChanges();
            
            // return the updated Quiz to the client.
            return new JsonResult(termin.Adapt<TerminViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// Löscht einen Termin über die {id} auf der DB
        /// </summary>
        /// <param name="id">The ID of an existing Termin</param>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // retrieve the quiz from the Database
            var termin = DbContext.Termine.FirstOrDefault(i => i.Id == id);
            
            // handle requests asking for non-existing quizzes
            if (termin == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Termin ID {0} nicht gefunden.", id)
                });
            }
            
            // Termin vom DBContext löschen
            DbContext.Termine.Remove(termin);
            // persist the changes into the Database.
            DbContext.SaveChanges();
            // return an HTTP Status 200 (OK).
            return new OkResult();
        }
        #endregion
        
        // GET api/gruppen/alle
        [HttpGet("alle/{idGruppe}")]
        public IActionResult alle(int idGruppe)
        {
            if (idGruppe > 0)
            {
                var termine = DbContext.Termine
                    .Where(q => q.IdGruppe == idGruppe)
                    .OrderBy(q => q.DatumBeginn)
                    .ToArray();
                return new JsonResult(
                    termine.Adapt<TerminViewModel[]>(),
                    JsonSettings);
            }
            else
            {   // alle Aktiviäten
                var termine = DbContext.Termine
                    .OrderBy(q => q.IdGruppe).ThenBy(q => q.DatumBeginn)    
                    .ToArray();
                return new JsonResult(
                    termine.Adapt<TerminViewModel[]>(),
                    JsonSettings);
            }
            
            
        }
        
        // GET api/termine/spez
        [HttpGet("vtermine/{idGruppe}")]
        public IActionResult vtermine(int idGruppe)
        {
            if (idGruppe > 0)
            {
                var query = (from ut in DbContext.Termine
                             from ua in DbContext.CodesAktivitaeten.Where(x => x.Id == ut.IdAktivitaet).DefaultIfEmpty()
                             from uu in DbContext.Teilnehmer.Where(x => x.Id == ut.IdTeilnehmer).DefaultIfEmpty()
                             from ug in DbContext.Gruppen.Where(x => x.Id == ut.IdGruppe).DefaultIfEmpty()
                             where ut.IdGruppe == idGruppe
                             select new
                             {
                                 ut.Id,
                                 ut.IdTermin,
                                 ut.IdGruppe,
                                 ut.IdTeilnehmer,
                                 ut.IdAktivitaet,
                                 ut.GanzerTag,
                                 ut.DatumBeginn,
                                 ut.DatumEnde,
                                 ut.Hinweis,
                                 ut.CreatedDate,
                                 ut.LastModifiedDate,
                                 AktFarbe = ua.Farbe,
                                 AktCode = ua.Code,
                                 AktBezeichnung = ua.Bezeichnung,
                                 AktSummieren = ua.Summieren,
                                 TnVorname = uu.Vorname,
                                 TnNachname = uu.Nachname,
                                 GrpCode = ug.Code,
                                 GrpBezeichnung = ug.Bezeichnung
                             }).OrderBy(x => x.DatumBeginn)
                               .ToList();
                return new JsonResult(
                    query.Adapt<TerminViewModel[]>(),
                    JsonSettings);    
            }
            else
            {
                var query = (from ut in DbContext.Termine
                             from ua in DbContext.CodesAktivitaeten.Where(x => x.Id == ut.IdAktivitaet).DefaultIfEmpty()
                             from uu in DbContext.Teilnehmer.Where(x => x.Id == ut.IdTeilnehmer).DefaultIfEmpty()
                             from ug in DbContext.Gruppen.Where(x => x.Id == ut.IdGruppe).DefaultIfEmpty()
                    select new
                    {
                        ut.Id,
                        ut.IdTermin,
                        ut.IdGruppe,
                        ut.IdTeilnehmer,
                        ut.IdAktivitaet,
                        ut.GanzerTag,
                        ut.DatumBeginn,
                        ut.DatumEnde,
                        ut.Hinweis,
                        ut.CreatedDate,
                        ut.LastModifiedDate,
                        AktFarbe = ua.Farbe,
                        AktCode = ua.Code,
                        AktBezeichnung = ua.Bezeichnung,
                        AktSummieren = ua.Summieren,
                        TnVorname = uu.Vorname,
                        TnNachname = uu.Nachname,
                        GrpCode = ug.Code,
                        GrpBezeichnung = ug.Bezeichnung
                    }).OrderBy(x => x.DatumBeginn)
                      .ToList();
                return new JsonResult(
                    query.Adapt<TerminViewModel[]>(),
                    JsonSettings);
            }
            
        }
    }
}

