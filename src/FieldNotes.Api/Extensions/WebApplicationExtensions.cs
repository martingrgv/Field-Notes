using FieldNotes.Api.Data.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FieldNotes.Api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication ApplyMigrations(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<WebApplication>>();
            using var dbContext = scope.ServiceProvider.GetRequiredService<FieldNotesDbContext>();

            try
            {
                dbContext.Database.Migrate();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Exception occured upon migrating!");
            }
        }

        return app;
    }
}
