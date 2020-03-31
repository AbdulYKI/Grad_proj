using grad_proj_api.Models;
using Microsoft.EntityFrameworkCore;
namespace grad_proj_api.Data {
    public class DataContext : DbContext {
        public DataContext (DbContextOptions<DataContext> options) : base (options) {

        }
        public DbSet<User> Users { get; set; }

        public DbSet<Photo> Photos { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Message> Meessages { get; set; }

        protected override void OnModelCreating (ModelBuilder modelBuilder) {
            //tell EF what is the primary key

            modelBuilder.Entity<Country> ()
                .HasKey (k => new { k.NumericCode });

            //explains the relationship between the likee in the likes table and the likers in the user table

            modelBuilder.Entity<Message> ()
                .HasOne (m => m.Sender)
                .WithMany (u => u.MessagesSent)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<Message> ()
                .HasOne (m => m.Recipient)
                .WithMany (u => u.MessagesReceived)
                .OnDelete (DeleteBehavior.Restrict);
            modelBuilder.Entity<User> ()
                .HasOne (u => u.Country)
                .WithMany (C => C.Users)
                .OnDelete (DeleteBehavior.Restrict)
                .HasForeignKey (u => u.CountryNumericCode);

        }
    }

}