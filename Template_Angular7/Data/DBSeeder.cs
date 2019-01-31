using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Template_Angular7.Services;

namespace Template_Angular7.Data
{
    public static class DBSeeder
    {
        
        #region Public Methods
        public static void Seed(ApplicationDbContext dbContext)
        {
            // Dummy-Benutzer erstellen
            if (!dbContext.Benutzer.Any()) CreateBenutzer(dbContext);
            
            // Dummy-Loginbenutzer erstellen
            if (!dbContext.LoginBenutzer.Any()) CreateLoginBenutzer(dbContext);

            // Dummy-Gruppen erstellen
            if (!dbContext.Gruppen.Any()) CreateGruppen(dbContext);
            
            // Dummy Aktivitätscodes erstellen
            if (!dbContext.CodesAktivitaeten.Any()) CreateAktiviaetscodes(dbContext);
            
            // Dummy Teilnehmer erstellen
            if (!dbContext.Teilnehmer.Any()) CreateTeilnehmer(dbContext);
            
            // Dummy Termine erstellen
            if (!dbContext.Termine.Any()) CreateTermine(dbContext);
        }
        #endregion
        
        #region Seed Methods
        private static void CreateBenutzer(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = new DateTime(2016, 03, 01, 12, 30, 00);
            DateTime lastModifiedDate = DateTime.Now;

            // Create the "Admin" ApplicationUser account (if it doesn't exist already)
            var user_Admin = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Admin",
                Email = "admin@gruppenverwaltung.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };

            // Insert the Admin user into the Database
            dbContext.Benutzer.Add(user_Admin);
            dbContext.SaveChanges();
        }
        
        
        // private helper methods

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        
        private static void CreateLoginBenutzer(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = new DateTime(2016, 03, 01, 12, 30, 00);
            DateTime lastModifiedDate = DateTime.Now;

            // Create the "Admin" LoginBenutzer account (if it doesn't exist already)
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash("admin", out passwordHash, out passwordSalt);
            
            var userAdmin = new LoginBenutzer()
            {
                Id = 1,
                UserName = "Admin",
                FirstName = "Victor",
                LastName =  "Kunz",
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                //Email = "admin@gruppenverwaltung.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };

            // Insert the Admin user into the Database
            dbContext.LoginBenutzer.Add(userAdmin);
            dbContext.SaveChanges();
        }
        
        private static void CreateGruppen(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = new DateTime(2017, 08, 08, 12, 30, 00);
            DateTime lastModifiedDate = DateTime.Now;

            // retrieve the admin user, which we'll use as default author.
            var authorId = dbContext.Benutzer
                .Where(u => u.UserName == "Admin")
                .FirstOrDefault()
                .Id;

            // erstelle die erste Demogruppe
            EntityEntry<Gruppe> e1 = dbContext.Gruppen.Add(new Gruppe()
            {
                UserId = authorId,
                Code = "Jassrunde",
                Beschreibung = "Jassrunde mit Trogner Jässler",
                Bezeichnung = @"Jassrunde, welche sich aus Trogner Jässler zusammensetzt.",
                //ViewCount = 2343,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
#if DEBUG
            // noch weitere 4 Demogruppen erstellen
            var num = 4;
            for (int i = 2; i <= num; i++)
            {
                ErstelleBeispielGruppen(
                    dbContext,
                    i,
                    authorId,
                    createdDate.AddDays(-num));
            }
#endif
           
            
            // persist the changes on the Database
            dbContext.SaveChanges();
        }
        
        private static void CreateAktiviaetscodes(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = DateTime.Now;
            DateTime lastModifiedDate = DateTime.Now;

            // retrieve the admin user, which we'll use as default author.
            var authorId = dbContext.Benutzer
                .Where(u => u.UserName == "Admin")
                .FirstOrDefault()
                .Id;
            var gruppeId = dbContext.Gruppen
                .Where(u => u.Code == "Jassrunde")
                .FirstOrDefault()
                .Id;

            // erstelle Aktivitätencodes
            EntityEntry<CodeAktivitaeten> e1 = dbContext.CodesAktivitaeten.Add(new CodeAktivitaeten()
            {
                GruppenId = gruppeId,
                Code = "Ja",
                Bezeichnung = "Jasser, Teilnehmer",
                Summieren = false,
                Farbe = "#f44141",
                GanzerTag = false,
                ZeitBeginn = new DateTime(createdDate.Year,createdDate.Month,createdDate.Day,19,00,00),
                ZeitEnde = new DateTime(createdDate.Year,createdDate.Month,createdDate.Day,21,00,00),
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<CodeAktivitaeten> e2 = dbContext.CodesAktivitaeten.Add(new CodeAktivitaeten()
            {
                GruppenId = gruppeId,
                Code = "JT",
                Bezeichnung = "Jasser + Teilnehmer",
                Summieren = false,
                Farbe = "#41f46a",
                GanzerTag = false,
                ZeitBeginn = new DateTime(2018,01,01,19,00,00),
                ZeitEnde = new DateTime(2018,01,01,21,00,00),
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<CodeAktivitaeten> e3 = dbContext.CodesAktivitaeten.Add(new CodeAktivitaeten()
            {
                GruppenId = gruppeId,
                Code = "Re",
                Bezeichnung = "Reserve, einsetzbar bei Bedarf",
                Summieren = false,
                Farbe = "#4141f4",
                GanzerTag = false,
                ZeitBeginn = new DateTime(2018,01,01,19,00,00),
                ZeitEnde = new DateTime(2018,01,01,21,00,00),
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<CodeAktivitaeten> e4 = dbContext.CodesAktivitaeten.Add(new CodeAktivitaeten()
            {
                GruppenId = gruppeId,
                Code = "??",
                Bezeichnung = "Klärt noch ab",
                Summieren = false,
                Farbe = "#dc41f4",
                GanzerTag = false,
                ZeitBeginn = new DateTime(2018,01,01,19,00,00),
                ZeitEnde = new DateTime(2018,01,01,21,00,00),
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<CodeAktivitaeten> e5 = dbContext.CodesAktivitaeten.Add(new CodeAktivitaeten()
            {
                GruppenId = gruppeId,
                Code = "??",
                Bezeichnung = "Jasser-Ausflug",
                Summieren = false,
                Farbe = "#345675",
                GanzerTag = true,
                ZeitBeginn = new DateTime(2018,01,01,00,00,00),
                ZeitEnde = new DateTime(2018,01,01,23,59,59),
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
                    
            // persist the changes on the Database
            dbContext.SaveChanges();
        }
        
        private static void CreateTeilnehmer(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = DateTime.Now;
            DateTime lastModifiedDate = DateTime.Now;

            var gruppeId = dbContext.Gruppen
                .Where(u => u.Code == "Jassrunde")
                .FirstOrDefault()
                .Id;

            // erstelle Teilnehmer
            EntityEntry<Teilnehmer> e1 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                GruppenId = gruppeId,
                Vorname = "Alex",
                Nachname = "Britschgi",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Teilnehmer> e2 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                GruppenId = gruppeId,
                Vorname = "René",
                Nachname = "Graf",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Teilnehmer> e3 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                GruppenId = gruppeId,
                Vorname = "Thomas",
                Nachname = "Hollenstein",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Teilnehmer> e4 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                GruppenId = gruppeId,
                Vorname = "René",
                Nachname = "Keller",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Teilnehmer> e5 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                GruppenId = gruppeId,
                Vorname = "Edu",
                Nachname = "Kozakiewicz",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Teilnehmer> e6 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                GruppenId = gruppeId,
                Vorname = "Hampi",
                Nachname = "Krüsi",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
                    
            // persist the changes on the Database
            dbContext.SaveChanges();
        }
        
        private static void CreateTermine(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = DateTime.Now;
            DateTime lastModifiedDate = DateTime.Now;

            var gruppeId = dbContext.Gruppen
                .Where(u => u.Code == "Jassrunde")
                .FirstOrDefault()
                .Id;

            // erstelle Termine
            EntityEntry<Termin> e1 = dbContext.Termine.Add(new Termin()
            {
                IdGruppe = gruppeId,
                IdTeilnehmer = 1,
                IdAktivitaet = 1,
                GanzerTag = false,
                DatumBeginn = createdDate,
                DatumEnde = createdDate,
                Hinweis = "Bin gerne mit dabei.",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Termin> e2 = dbContext.Termine.Add(new Termin()
            {
                IdGruppe = gruppeId,
                IdTeilnehmer = 2,
                IdAktivitaet = 2,
                GanzerTag = false,
                DatumBeginn = createdDate,
                DatumEnde = createdDate,
                Hinweis = "Bin auch mit dabei.",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Termin> e3 = dbContext.Termine.Add(new Termin()
            {
                IdGruppe = gruppeId,
                IdTeilnehmer = 3,
                IdAktivitaet = 4,
                GanzerTag = false,
                DatumBeginn = createdDate,
                DatumEnde = createdDate,
                Hinweis = "Mal guggen.",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            // persist the changes on the Database
            dbContext.SaveChanges();
        }
        
        #endregion
        
        #region Utility Methods
        /// <summary>
        /// Erstellt Demogruppen und speichert sie auf der Datenbank
        /// </summary>
        /// <param name="userId">Ersteller-ID</param>
        /// <param name="id">Gruppen-ID</param>
        /// <param name="createdDate">CreatedDate</param>
        private static void ErstelleBeispielGruppen(
            ApplicationDbContext dbContext,
            int num,
            string authorId,
            //int viewCount,
            DateTime createdDate)
        {
            var gruppe = new Gruppe()
            {
                UserId = authorId,
                Code = String.Format("Gruppe {0} Code", num),
                Bezeichnung = String.Format("Beispielgruppe {0}.", num),
                Beschreibung = "Dies ist eine automatisch von DBSeeder erstellte Gruppe.",
                CreatedDate = createdDate,
                LastModifiedDate = createdDate
            };
            dbContext.Gruppen.Add(gruppe);
            dbContext.SaveChanges();
            
        }
        #endregion
    }
}