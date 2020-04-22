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
        public DbSet<ProgrammingLanguage> ProgrammingLanguages { get; set; }
        public DbSet<UserProgrammingLanguage> UserProgrammingLanguages { get; set; }

        public DbSet<Post> Posts { get; set; }
        public DbSet<ViewedPost> ViewedPosts { get; set; }

        public DbSet<DownVotedPost> DownVotedPosts { get; set; }
        public DbSet<UpVotedPost> UpVotedPosts { get; set; }

        protected override void OnModelCreating (ModelBuilder modelBuilder) {
            //tell EF what is the primary key

            modelBuilder.Entity<Country> ()
                .HasKey (k => new { k.NumericCode });

            modelBuilder.Entity<UserProgrammingLanguage> ()
                .HasKey (upl => new { upl.UserId, upl.ProgrammingLanguageId });

            modelBuilder.Entity<ViewedPost> ()
                .HasKey (vp => new { vp.UserId, vp.PostId });

            modelBuilder.Entity<UpVotedPost> ()
                .HasKey (uvp => new { uvp.UserId, uvp.PostId });

            modelBuilder.Entity<DownVotedPost> ()
                .HasKey (dvp => new { dvp.UserId, dvp.PostId });

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

            modelBuilder.Entity<UserProgrammingLanguage> ()
                .HasOne (u => u.User)
                .WithMany (pl => pl.UserProgrammingLanguages)
                .HasForeignKey (u => u.UserId)
                .OnDelete (DeleteBehavior.Restrict);
            modelBuilder.Entity<UserProgrammingLanguage> ()
                .HasOne (pl => pl.ProgrammingLanguage)
                .WithMany (u => u.Users)
                .HasForeignKey (pl => pl.ProgrammingLanguageId)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<ViewedPost> ()
                .HasOne (u => u.User)
                .WithMany (p => p.PostsViewed)
                .HasForeignKey (u => u.UserId)
                .OnDelete (DeleteBehavior.Restrict);
            modelBuilder.Entity<ViewedPost> ()
                .HasOne (p => p.Post)
                .WithMany (u => u.PostViewers)
                .HasForeignKey (p => p.PostId)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<UpVotedPost> ()
                .HasOne (u => u.User)
                .WithMany (p => p.PostsUpVoted)
                .HasForeignKey (u => u.UserId)
                .OnDelete (DeleteBehavior.Restrict);
            modelBuilder.Entity<UpVotedPost> ()
                .HasOne (p => p.Post)
                .WithMany (u => u.PostUpVoters)
                .HasForeignKey (p => p.PostId)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<DownVotedPost> ()
                .HasOne (u => u.User)
                .WithMany (p => p.PostsDownVoted)
                .HasForeignKey (u => u.UserId)
                .OnDelete (DeleteBehavior.Restrict);
            modelBuilder.Entity<DownVotedPost> ()
                .HasOne (p => p.Post)
                .WithMany (u => u.PostDownVoters)
                .HasForeignKey (p => p.PostId)
                .OnDelete (DeleteBehavior.Restrict);
        }
    }

}