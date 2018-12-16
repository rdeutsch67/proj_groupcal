Installation von PostgreSql im .Net-Projekt:

1. PostgreSQL/Npgsql provider for Entity Framework Core installieren:
   -> https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL
   -> NuGet "Npgsql.EntityFrameworkCore.PostgreSQL"
3. Microsoft.EntityFrameworkCore.Design
4. Npgsql.EntityFrameworkCore.PostgreSQL.Design
5. Microsoft.EntityFrameworkCore.Tools.DotNet 
6. Das war alles. 

zusätzliche Infos: 
- https://blog.jetbrains.com/dotnet/2017/08/09/running-entity-framework-core-commands-rider/
- https://www.youtube.com/watch?v=md20lQut9EE

DB-Commands für das Erstellen des DB-Schemas
1. dotnet ef migrations add InitialMigration -v  (Entfernen einer bestehenden Migration über "dotnet ef migrations remove" oder Migrations-Verzeichnis löschen)
2. dotnet ef database update

-> bei Fehlermeldung "The name 'InitialMigration' is used by an existing migration.":
1. dotnet ef database update 0
2. dotnet ef migrations remove
dann
3. dotnet ef migrations add InitialMigration -v
4. dotnet ef database update

Tipps bei Fehlermeldungen:

-> can't bind to 'formgroup' since it isn't a known property of 'form'. in
Lösung:
-> app.module.ts: imports: ReactiveFormsModule

JsonResult liefert nur einen leeren Json-Datensatz:
z.B. 
   return new JsonResult(
                codeAktivitaeten.Adapt<CodeAktivitaetenViewModel>(),
                JsonSettings);
                
-> da ein Array von Datensätzen erwartet wird, fehlen oben die Brackets []
-> return new JsonResult(
                   codeAktivitaeten.Adapt<CodeAktivitaetenViewModel[]>(),
                   JsonSettings); 
                   
Komponenten:

Bootstrap 4
NgxBootstrap (bsDatepicker)                                