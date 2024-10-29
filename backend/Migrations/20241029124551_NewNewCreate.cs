using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IdentityApi.Migrations
{
    /// <inheritdoc />
    public partial class NewNewCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HouseholdId",
                table: "CompleteTasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_CompleteTasks_HouseholdId",
                table: "CompleteTasks",
                column: "HouseholdId");

            migrationBuilder.AddForeignKey(
                name: "FK_CompleteTasks_Households_HouseholdId",
                table: "CompleteTasks",
                column: "HouseholdId",
                principalTable: "Households",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompleteTasks_Households_HouseholdId",
                table: "CompleteTasks");

            migrationBuilder.DropIndex(
                name: "IX_CompleteTasks_HouseholdId",
                table: "CompleteTasks");

            migrationBuilder.DropColumn(
                name: "HouseholdId",
                table: "CompleteTasks");
        }
    }
}
