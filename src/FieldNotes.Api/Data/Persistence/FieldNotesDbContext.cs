using FieldNotes.Api.Data.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace FieldNotes.Api.Data.Persistence;

public class FieldNotesDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Note> Notes { get; set; }
}
