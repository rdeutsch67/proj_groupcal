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
    public class GruppenController : BaseApiController
    /*public class GruppenController : Controller*/
    {
        #region Constructor
        public GruppenController(ApplicationDbContext context): base(context) { }
        #endregion Constructor
        
        #region RESTful conventions methods
        /// <summary>
        /// GET: api/gruppen/{id}
        /// Retrieves the Quiz with the given {id}
        /// </summary>
        /// <param name="id">The ID of an existing Quiz</param>
        /// <returns>the Quiz with the given {id}</returns>
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var gruppe = DbContext.Gruppen.FirstOrDefault(i => i.Id == id);
            // handle requests asking for non-existing quizzes
            if (gruppe == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Gruppe ID {0} nicht gefunden", id)
                });
            }
            
            return new JsonResult(
                gruppe.Adapt<GruppenViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// neue Gruppe in die DB eintragen
        /// </summary>
        /// <param name="model">The GruppenViewModel containing the data to insert</param>
        [HttpPut]
        public IActionResult Put([FromBody]GruppenViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);
            
            // handle the insert (without object-mapping)
            var gruppe = new Gruppe();
            
            // properties taken from the request
            gruppe.Code = model.Code;
            gruppe.Beschreibung = model.Beschreibung;
            gruppe.Bezeichnung = model.Bezeichnung;
            gruppe.Aktiv = model.Aktiv;
            // properties set from server-side
            gruppe.CreatedDate = DateTime.Now;
            gruppe.LastModifiedDate = gruppe.CreatedDate;
            
            // Set a temporary author using the Admin user's userId
            // as user login isn't supported yet: we'll change this later on.
            gruppe.UserId = DbContext.Benutzer.FirstOrDefault(u => u.UserName == "Admin").Id;
            
            // add the new quiz
            DbContext.Gruppen.Add(gruppe);
            // persist the changes into the Database.
            DbContext.SaveChanges();
            // return the newly-created Quiz to the client.
            return new JsonResult(gruppe.Adapt<GruppenViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// Gruppe anhand der {id} editieren
        /// </summary>
        /// <param name="model">The GruppenViewModel containing the data to update</param>
        [HttpPost]
        public IActionResult Post([FromBody]GruppenViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);
            
            // retrieve the quiz to edit
            var gruppe = DbContext.Gruppen.FirstOrDefault(q => q.Id == model.Id);
            
            // handle requests asking for non-existing quizzes
            if (gruppe == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Gruppe ID {0} nicht gefunden.", model.Id)
                });
            }
            
            // handle the update (without object-mapping)
            // by manually assigning the properties
            // we want to accept from the request
            gruppe.Code = model.Code;
            gruppe.Bezeichnung = model.Bezeichnung;
            gruppe.Beschreibung = model.Beschreibung;
            gruppe.Aktiv = model.Aktiv;
            // properties set from server-side
            gruppe.LastModifiedDate = gruppe.CreatedDate;
            
            // persist the changes into the Database.
            DbContext.SaveChanges();
            
            // return the updated Quiz to the client.
            return new JsonResult(gruppe.Adapt<GruppenViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// Löscht eine Gruppen über die {id} auf der DB
        /// </summary>
        /// <param name="id">The ID of an existing Test</param>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // retrieve the quiz from the Database
            var gruppe = DbContext.Gruppen.FirstOrDefault(i => i.Id == id);
            
            // handle requests asking for non-existing quizzes
            if (gruppe == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Gruppe ID {0} nicht gefunden.", id)
                });
            }
            
            // Gruppe vom DBContext löschen
            DbContext.Gruppen.Remove(gruppe);
            // persist the changes into the Database.
            DbContext.SaveChanges();
            // return an HTTP Status 200 (OK).
            return new OkResult();
        }
        #endregion
        
        // GET api/gruppen/alle
        [HttpGet("Alle/{num?}")]
        public IActionResult Alle(int num = 10)
        {

            if (num > 0)
            {
                var myGruppen = DbContext.Gruppen
                    .OrderByDescending(q => q.CreatedDate)
                    .Take(num)
                    .ToArray();
                return new JsonResult(
                    myGruppen.Adapt<GruppenViewModel[]>(),
                    new JsonSerializerSettings()
                    {
                        Formatting = Formatting.Indented
                    });    
            }
            else
            {
                var myGruppen = DbContext.Gruppen
                    .OrderByDescending(q => q.CreatedDate)
                    .ToArray();
                return new JsonResult(
                    myGruppen.Adapt<GruppenViewModel[]>(),
                    new JsonSerializerSettings()
                    {
                        Formatting = Formatting.Indented
                    });
            }
            
        }
    }
}
