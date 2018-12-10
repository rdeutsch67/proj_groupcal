using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Template_Angular7.ViewModels;
using System.Collections.Generic;
using System.Linq;
using Template_Angular7.Data;
using Template_Angular7.Controllers;
using Mapster;

namespace Template_Angular7.Controllers
{
    [Route("api/[controller]")]
    public class TeilnehmerController : BaseApiController
    {
        #region Constructor
        public TeilnehmerController(ApplicationDbContext context): base(context) { }
        #endregion Constructor
        
        #region RESTful conventions methods
        /// <summary>
        /// GET: api/teilnehmer/{id}
        /// Retrieves the Teilnehmer with the given {id}
        /// </summary>
        /// <param name="id">The ID of an existing Teilnehmer</param>
        /// <returns>the Teilnehmer with the given {id}</returns>
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var teilnehmer = DbContext.Teilnehmer.FirstOrDefault(i => i.Id == id);
            
            // handle requests asking for non-existing quizzes
            if (teilnehmer == null)
            {
                return NotFound(new
                {
                    Error = String.Format("teilnehmer ID {0} nicht gefunden", id)
                });
            }
            
            return new JsonResult(
                teilnehmer.Adapt<TeilnehmerViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// neuen Teilnehmer in die DB eintragen
        /// </summary>
        /// <param name="model">The TeilnehmerViewModel containing the data to insert</param>
        [HttpPut]
        public IActionResult Put([FromBody]TeilnehmerViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);
            
            // handle the insert (without object-mapping)
            var teilnehmer = new Teilnehmer();
            
            // properties taken from the request
            teilnehmer.GruppenId = model.GruppenId;
            teilnehmer.Vorname = model.Vorname;
            teilnehmer.Nachname = model.Nachname;
            teilnehmer.Berechtigungen = model.Berechtigungen;
            // properties set from server-side
            teilnehmer.CreatedDate = DateTime.Now;
            teilnehmer.LastModifiedDate = teilnehmer.CreatedDate;
            // add the new quiz
            DbContext.Teilnehmer.Add(teilnehmer);
            // persist the changes into the Database.
            DbContext.SaveChanges();
            // return the newly-created Quiz to the client.
            return new JsonResult(teilnehmer.Adapt<CodeAktivitaetenViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// Teilnehmer anhand der {id} editieren
        /// </summary>
        /// <param name="model">The TeilnehmerViewModel containing the data to update</param>
        [HttpPost]
        public IActionResult Post([FromBody]TeilnehmerViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);
            
            // Aktivität holen 
            var teilnehmer = DbContext.Teilnehmer.Where(q => q.Id == model.Id).FirstOrDefault();
            
            // handle requests asking for non-existing quizzes
            if (teilnehmer == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Aktivität ID {0} nicht gefunden.", model.Id)
                });
            }
            
            // handle the update (without object-mapping)
            // by manually assigning the properties
            // we want to accept from the request
            teilnehmer.GruppenId = model.GruppenId;
            teilnehmer.Vorname = model.Vorname;
            teilnehmer.Nachname = model.Nachname;
            teilnehmer.Berechtigungen = model.Berechtigungen;
            // properties set from server-side
            teilnehmer.LastModifiedDate = teilnehmer.CreatedDate;
            
            // persist the changes into the Database.
            DbContext.SaveChanges();
            
            // return the updated Quiz to the client.
            return new JsonResult(teilnehmer.Adapt<TeilnehmerViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// Löscht einen Teilnehmer über die {id} auf der DB
        /// </summary>
        /// <param name="id">The ID of an existing Teilnehmer</param>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // retrieve the quiz from the Database
            var teilnehmer = DbContext.Teilnehmer.FirstOrDefault(i => i.Id == id);
            
            // handle requests asking for non-existing quizzes
            if (teilnehmer == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Teilnehmer ID {0} nicht gefunden.", id)
                });
            }
            
            // Aktivität vom DBContext löschen
            DbContext.Teilnehmer.Remove(teilnehmer);
            // persist the changes into the Database.
            DbContext.SaveChanges();
            // return an HTTP Status 200 (OK).
            return new OkResult();
        }
        #endregion
        
        // GET api/teilnehmer/alle
        [HttpGet("alle/{gruppenId}")]
        public IActionResult alle(int gruppenId)
        {
            if (gruppenId > 0)
            {
                var teilnehmer = DbContext.Teilnehmer
                    .Where(q => q.GruppenId == gruppenId)
                    .OrderBy(q => q.Vorname)
                    .ToArray();
                return new JsonResult(
                    teilnehmer.Adapt<TeilnehmerViewModel[]>(),
                    JsonSettings);
            }
            else
            {   // alle Aktiviäten
                var teilnehmer = DbContext.Teilnehmer
                    .Where(q => q.GruppenId != gruppenId)
                    .OrderBy(q => q.GruppenId).ThenBy(q => q.Vorname)
                    .ToArray();
                return new JsonResult(
                    teilnehmer.Adapt<TeilnehmerViewModel[]>(),
                    JsonSettings);
            }
            
            
        }
        
        // GET api/teilnehmer/vteilnehmer
        [HttpGet("vteilnehmer/{idGruppe}")]
        public IActionResult vteilnehmer(int idGruppe)
        {

            if (idGruppe > 0)
            {
                var query = (from ut in DbContext.Teilnehmer
                    join ug in DbContext.Gruppen on ut.GruppenId equals ug.Id
                    where ut.GruppenId == idGruppe
                    select new
                    {
                        ut.Id,
                        ut.GruppenId,
                        ut.Vorname,
                        ut.Nachname,
                        ut.Berechtigungen,
                        GruppeCode = ug.Code,
                        GruppeBezeichnung = ug.Bezeichnung,
                        GruppeUserId = ug.UserId,
                        GruppeAktiv = ug.Aktiv
                    }).ToList();
                return new JsonResult(
                    query.Adapt<TeilnehmerViewModel[]>(),
                    JsonSettings); 
            }
            else
            {
                var query = (from ut in DbContext.Teilnehmer
                    join ug in DbContext.Gruppen on ut.GruppenId equals ug.Id
                    select new
                    {
                        ut.Id,
                        ut.GruppenId,
                        ut.Vorname,
                        ut.Nachname,
                        ut.Berechtigungen,
                        GruppeCode = ug.Code,
                        GruppeBezeichnung = ug.Bezeichnung,
                        GruppeUserId = ug.UserId,
                        GruppeAktiv = ug.Aktiv
                    }).ToList();
                return new JsonResult(
                    query.Adapt<TeilnehmerViewModel[]>(),
                    JsonSettings);
            }
            
        }
    }
}
