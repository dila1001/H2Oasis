using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace H2Oasis.Api.Migrations
{
    /// <inheritdoc />
    public partial class NewModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Plants",
                table: "Plants");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Plants",
                newName: "HouseholdId");

            migrationBuilder.AddColumn<Guid>(
                name: "PlantId",
                table: "Plants",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "LastWateredBy",
                table: "Plants",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Plants",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Plants",
                table: "Plants",
                column: "PlantId");

            migrationBuilder.CreateTable(
                name: "Households",
                columns: table => new
                {
                    HouseholdId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Households", x => x.HouseholdId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserHouseholds",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    HouseholdId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserHouseholds", x => new { x.UserId, x.HouseholdId });
                    table.ForeignKey(
                        name: "FK_UserHouseholds_Households_HouseholdId",
                        column: x => x.HouseholdId,
                        principalTable: "Households",
                        principalColumn: "HouseholdId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserHouseholds_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Plants_HouseholdId",
                table: "Plants",
                column: "HouseholdId");

            migrationBuilder.CreateIndex(
                name: "IX_UserHouseholds_HouseholdId",
                table: "UserHouseholds",
                column: "HouseholdId");

            migrationBuilder.AddForeignKey(
                name: "FK_Plants_Households_HouseholdId",
                table: "Plants",
                column: "HouseholdId",
                principalTable: "Households",
                principalColumn: "HouseholdId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Plants_Households_HouseholdId",
                table: "Plants");

            migrationBuilder.DropTable(
                name: "UserHouseholds");

            migrationBuilder.DropTable(
                name: "Households");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Plants",
                table: "Plants");

            migrationBuilder.DropIndex(
                name: "IX_Plants_HouseholdId",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "PlantId",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "LastWateredBy",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Plants");

            migrationBuilder.RenameColumn(
                name: "HouseholdId",
                table: "Plants",
                newName: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Plants",
                table: "Plants",
                column: "Id");
        }
    }
}
