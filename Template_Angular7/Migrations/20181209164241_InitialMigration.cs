using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Template_Angular7.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(maxLength: 128, nullable: false),
                    Email = table.Column<string>(nullable: false),
                    DisplayName = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    Flags = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    LastModifiedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TGruppen",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Code = table.Column<string>(nullable: false),
                    Bezeichnung = table.Column<string>(nullable: true),
                    Beschreibung = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false),
                    Aktiv = table.Column<bool>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    LastModifiedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TGruppen", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TGruppen_TUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "TUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TAktivitaeten",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    GruppenId = table.Column<int>(nullable: false),
                    Code = table.Column<string>(nullable: false),
                    Bezeichnung = table.Column<string>(nullable: false),
                    Farbe = table.Column<string>(nullable: false),
                    Summieren = table.Column<bool>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    LastModifiedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TAktivitaeten", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TAktivitaeten_TGruppen_GruppenId",
                        column: x => x.GruppenId,
                        principalTable: "TGruppen",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TTeilnehmer",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    GruppenId = table.Column<int>(nullable: false),
                    Vorname = table.Column<string>(nullable: false),
                    Nachname = table.Column<string>(nullable: false),
                    Berechtigungen = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    LastModifiedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TTeilnehmer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TTeilnehmer_TGruppen_GruppenId",
                        column: x => x.GruppenId,
                        principalTable: "TGruppen",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TTermine",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    IdGruppe = table.Column<int>(nullable: false),
                    IdTeilnehmer = table.Column<int>(nullable: false),
                    IdAktivitaet = table.Column<int>(nullable: false),
                    Datum = table.Column<DateTime>(nullable: false),
                    Hinweis = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    LastModifiedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TTermine", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TTermine_TAktivitaeten_IdAktivitaet",
                        column: x => x.IdAktivitaet,
                        principalTable: "TAktivitaeten",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TTermine_TGruppen_IdGruppe",
                        column: x => x.IdGruppe,
                        principalTable: "TGruppen",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TTermine_TTeilnehmer_IdTeilnehmer",
                        column: x => x.IdTeilnehmer,
                        principalTable: "TTeilnehmer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TAktivitaeten_GruppenId",
                table: "TAktivitaeten",
                column: "GruppenId");

            migrationBuilder.CreateIndex(
                name: "IX_TGruppen_UserId",
                table: "TGruppen",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TTeilnehmer_GruppenId",
                table: "TTeilnehmer",
                column: "GruppenId");

            migrationBuilder.CreateIndex(
                name: "IX_TTermine_IdAktivitaet",
                table: "TTermine",
                column: "IdAktivitaet");

            migrationBuilder.CreateIndex(
                name: "IX_TTermine_IdGruppe",
                table: "TTermine",
                column: "IdGruppe");

            migrationBuilder.CreateIndex(
                name: "IX_TTermine_IdTeilnehmer",
                table: "TTermine",
                column: "IdTeilnehmer");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TTermine");

            migrationBuilder.DropTable(
                name: "TAktivitaeten");

            migrationBuilder.DropTable(
                name: "TTeilnehmer");

            migrationBuilder.DropTable(
                name: "TGruppen");

            migrationBuilder.DropTable(
                name: "TUsers");
        }
    }
}
