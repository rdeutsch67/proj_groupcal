using System;
using Microsoft.AspNetCore.Mvc;
using Template_Angular7.ViewModels;
using System.Collections.Generic;
using Template_Angular7.Data;
using Mapster;
using Newtonsoft.Json;

namespace Template_Angular7.Controllers
{
    [Route("api/[controller]")]
    public class ZzTerminAnzWiederholungenController : BaseApiController
    {
        #region Constructor
        public ZzTerminAnzWiederholungenController(ApplicationDbContext context): base(context) { }
        #endregion Constructor


        // GET api/zzterminanzwiederholungen/all/num
        [HttpGet("All/{num}")]
        public IActionResult All(int num = 10)
        {
            var zzDatenliste = new List<ZzTerminAnzWiederholungenViewModel>();

            for (int i = 1; i <= num; i++)
            {
                zzDatenliste.Add(new ZzTerminAnzWiederholungenViewModel()
                {
                    Id = 1,
                    Count = i,
                    Bezeichnung = String.Format("nach {0} Mal", i),
                    CreatedDate = DateTime.Now,
                    LastModifiedDate = DateTime.Now
                });
            }
            return new JsonResult(
                zzDatenliste.Adapt<ZzTerminAnzWiederholungenViewModel[]>(),
                JsonSettings);
        }
    }
}