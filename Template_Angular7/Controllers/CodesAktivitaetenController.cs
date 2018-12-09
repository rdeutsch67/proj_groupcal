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
    public class CodesAktivitaetenController : BaseApiController
    {
        #region Constructor
        public CodesAktivitaetenController(ApplicationDbContext context): base(context) { }
        #endregion Constructor
        
        #region RESTful conventions methods
        /// <summary>
        /// GET: api/codesaktivitaeten/{id}
        /// Retrieves the Aktivität with the given {id}
        /// </summary>
        /// <param name="id">The ID of an existing Aktivität</param>
        /// <returns>the Aktivität with the given {id}</returns>
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var codeAktivitaet = DbContext.CodesAktivitaeten.FirstOrDefault(i => i.Id == id);
            
            // handle requests asking for non-existing quizzes
            if (codeAktivitaet == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Aktivität ID {0} nicht gefunden", id)
                });
            }
            
            return new JsonResult(
                codeAktivitaet.Adapt<CodeAktivitaetenViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        /// <summary>
        /// neue Aktivität in die DB eintragen
        /// </summary>
        /// <param name="model">The CodeAktivitaetenViewModel containing the data to insert</param>
        [HttpPut]
        public IActionResult Put([FromBody]CodeAktivitaetenViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);
            
            // handle the insert (without object-mapping)
            var codeAktivitaet = new CodeAktivitaeten();
            
            // properties taken from the request
            codeAktivitaet.GruppenId = model.GruppenId;
            codeAktivitaet.Code = model.Code;
            codeAktivitaet.Bezeichnung = model.Bezeichnung;
            codeAktivitaet.Summieren = model.Summieren;
            codeAktivitaet.Farbe = model.Farbe;
            // properties set from server-side
            codeAktivitaet.CreatedDate = DateTime.Now;
            codeAktivitaet.LastModifiedDate = codeAktivitaet.CreatedDate;
            // add the new quiz
            DbContext.CodesAktivitaeten.Add(codeAktivitaet);
            // persist the changes into the Database.
            DbContext.SaveChanges();
            // return the newly-created Quiz to the client.
            return new JsonResult(codeAktivitaet.Adapt<CodeAktivitaetenViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// Aktivität anhand der {id} editieren
        /// </summary>
        /// <param name="model">The CodeAktivitaetenViewModel containing the data to update</param>
        [HttpPost]
        public IActionResult Post([FromBody]CodeAktivitaetenViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);
            
            // Aktivität holen 
            var codeAktivitaet = DbContext.CodesAktivitaeten.Where(q => q.Id == model.Id).FirstOrDefault();
            
            // handle requests asking for non-existing quizzes
            if (codeAktivitaet == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Aktivität ID {0} nicht gefunden.", model.Id)
                });
            }
            
            // handle the update (without object-mapping)
            // by manually assigning the properties
            // we want to accept from the request
            codeAktivitaet.GruppenId = model.GruppenId;
            codeAktivitaet.Code = model.Code;
            codeAktivitaet.Bezeichnung = model.Bezeichnung;
            codeAktivitaet.Summieren = model.Summieren;
            codeAktivitaet.Farbe = model.Farbe;
            // properties set from server-side
            codeAktivitaet.LastModifiedDate = codeAktivitaet.CreatedDate;
            
            // persist the changes into the Database.
            DbContext.SaveChanges();
            
            // return the updated Quiz to the client.
            return new JsonResult(codeAktivitaet.Adapt<CodeAktivitaetenViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// Löscht eine Aktivität über die {id} auf der DB
        /// </summary>
        /// <param name="id">The ID of an existing Aktivität</param>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // retrieve the quiz from the Database
            var codeAktivitaet = DbContext.CodesAktivitaeten.FirstOrDefault(i => i.Id == id);
            
            // handle requests asking for non-existing quizzes
            if (codeAktivitaet == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Aktivität ID {0} nicht gefunden.", id)
                });
            }
            
            // Aktivität vom DBContext löschen
            DbContext.CodesAktivitaeten.Remove(codeAktivitaet);
            // persist the changes into the Database.
            DbContext.SaveChanges();
            // return an HTTP Status 200 (OK).
            return new OkResult();
        }
        #endregion
        
        // GET api/gruppen/alle
        [HttpGet("alle/{gruppenId}")]
        public IActionResult alle(int gruppenId)
        {
            if (gruppenId > 0)
            {
                var codeAktivitaeten = DbContext.CodesAktivitaeten
                    .Where(q => q.GruppenId == gruppenId)
                    .OrderBy(q => q.Code)
                    .ToArray();
                return new JsonResult(
                    codeAktivitaeten.Adapt<CodeAktivitaetenViewModel[]>(),
                    JsonSettings);
            }
            else
            {   // alle Aktiviäten
                var codeAktivitaeten = DbContext.CodesAktivitaeten
                    .OrderBy(q => q.GruppenId).ThenBy(q => q.Code)    
                    .ToArray();
                return new JsonResult(
                    codeAktivitaeten.Adapt<CodeAktivitaetenViewModel[]>(),
                    JsonSettings);
            }
            
            
        }
    }
}
