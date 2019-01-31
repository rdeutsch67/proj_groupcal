using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Template_Angular7.ViewModels;

namespace Template_Angular7.Data
{
    public class ApplicationDbContext : DbContext
    {
        #region Constructor
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }
        #endregion Constructor
        
        #region Methods
        protected override void OnModelCreating(ModelBuilder
            modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ApplicationUser>().ToTable("TUsers");
            modelBuilder.Entity<ApplicationUser>().HasMany(u => u.Gruppen).WithOne(i => i.User);
            
            modelBuilder.Entity<LoginBenutzer>().ToTable("TLoginBenutzer");
            modelBuilder.Entity<LoginBenutzer>().Property(i => i.Id).ValueGeneratedOnAdd();
            //modelBuilder.Entity<ApplicationUser>().HasMany(u => u.Gruppen).WithOne(i => i.User);
            
            modelBuilder.Entity<Gruppe>().ToTable("TGruppen");
            modelBuilder.Entity<Gruppe>().Property(i => i.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Gruppe>().HasOne(i => i.User).WithMany(u => u.Gruppen);
            modelBuilder.Entity<Gruppe>().HasMany(i => i.CodesAktivitaeten).WithOne(u => u.Gruppe);
            modelBuilder.Entity<Gruppe>().HasMany(i => i.Teilnehmer).WithOne(u => u.Gruppe);
            modelBuilder.Entity<Gruppe>().HasMany(i => i.Termine).WithOne(u => u.Gruppe);
            
            modelBuilder.Entity<CodeAktivitaeten>().ToTable("TAktivitaeten");
            modelBuilder.Entity<CodeAktivitaeten>().Property(i => i.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<CodeAktivitaeten>().HasOne(i => i.Gruppe).WithMany(u => u.CodesAktivitaeten);
            modelBuilder.Entity<CodeAktivitaeten>().HasMany(i => i.Termine).WithOne(u => u.CodesAktivitaeten);
            
            modelBuilder.Entity<Teilnehmer>().ToTable("TTeilnehmer");
            modelBuilder.Entity<Teilnehmer>().Property(i => i.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Teilnehmer>().HasOne(i => i.Gruppe).WithMany(u => u.Teilnehmer);
            modelBuilder.Entity<Teilnehmer>().HasMany(i => i.Termine).WithOne(u => u.Teilnehmer);
            
            modelBuilder.Entity<Termin>().ToTable("TTermine");
            modelBuilder.Entity<Termin>().Property(i => i.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Termin>().HasOne(i => i.Gruppe).WithMany(u => u.Termine);
            modelBuilder.Entity<Termin>().HasOne(i => i.Teilnehmer).WithMany(u => u.Termine);
            modelBuilder.Entity<Termin>().HasOne(i => i.CodesAktivitaeten).WithMany(u => u.Termine);
        }
        #endregion Methods
        
        #region Properties
        public DbSet<ApplicationUser> Benutzer { get; set; }
        public DbSet<LoginBenutzer> LoginBenutzer { get; set; }
        public DbSet<Gruppe> Gruppen { get; set; }
        public DbSet<CodeAktivitaeten> CodesAktivitaeten { get; set; }
        public DbSet<Teilnehmer> Teilnehmer { get; set; }
        public DbSet<Termin> Termine { get; set; }
        #endregion Properties
    }
}