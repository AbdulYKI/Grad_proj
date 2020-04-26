using grad_proj_api.Models;
using Microsoft.EntityFrameworkCore;
namespace grad_proj_api.Data {
    public class DataContext : DbContext {
        public DataContext (DbContextOptions<DataContext> options) : base (options) {

        }
        public DbSet<User> Users { get; set; }

        public DbSet<Photo> Photos { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Message> Meessages { get; set; }
        public DbSet<ProgrammingLanguage> ProgrammingLanguages { get; set; }
        public DbSet<UserProgrammingLanguage> UserProgrammingLanguages { get; set; }

        public DbSet<Post> Posts { get; set; }
        public DbSet<ViewedPost> ViewedPosts { get; set; }

        public DbSet<DownVotedPost> DownVotedPosts { get; set; }
        public DbSet<DownVotedComment> DownVotedComments { get; set; }
        public DbSet<UpVotedPost> UpVotedPosts { get; set; }
        public DbSet<UpVotedComment> UpVotedComments { get; set; }

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

            modelBuilder.Entity<DownVotedComment> ()
                .HasKey (dvc => new { dvc.UserId, dvc.CommentId });

            modelBuilder.Entity<UpVotedComment> ()
                .HasKey (uvc => new { uvc.UserId, uvc.CommentId });
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
                .WithMany (p => p.ViewedPosts)
                .HasForeignKey (u => u.UserId)
                .OnDelete (DeleteBehavior.Restrict);
            modelBuilder.Entity<ViewedPost> ()
                .HasOne (p => p.Post)
                .WithMany (u => u.PostViewers)
                .HasForeignKey (p => p.PostId)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<UpVotedPost> ()
                .HasOne (u => u.User)
                .WithMany (p => p.UpVotedPosts)
                .HasForeignKey (u => u.UserId)
                .OnDelete (DeleteBehavior.Restrict);
            modelBuilder.Entity<UpVotedPost> ()
                .HasOne (p => p.Post)
                .WithMany (u => u.PostUpVoters)
                .HasForeignKey (p => p.PostId)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<DownVotedPost> ()
                .HasOne (u => u.User)
                .WithMany (p => p.DownVotedPosts)
                .HasForeignKey (u => u.UserId)
                .OnDelete (DeleteBehavior.Restrict);
            modelBuilder.Entity<DownVotedPost> ()
                .HasOne (p => p.Post)
                .WithMany (u => u.PostDownVoters)
                .HasForeignKey (p => p.PostId)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment> ()
                .HasOne (u => u.User)
                .WithMany (c => c.Comments)
                .HasForeignKey (u => u.UserId)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<DownVotedComment> ()
                .HasOne (u => u.User)
                .WithMany (c => c.DownVotedComments)
                .HasForeignKey (u => u.UserId)
                .OnDelete (DeleteBehavior.Restrict);
            modelBuilder.Entity<DownVotedComment> ()
                .HasOne (c => c.Comment)
                .WithMany (u => u.CommentDownVoters)
                .HasForeignKey (c => c.CommentId)
                .OnDelete (DeleteBehavior.Restrict);

            modelBuilder.Entity<UpVotedComment> ()
                .HasOne (u => u.User)
                .WithMany (c => c.UpVotedComments)
                .HasForeignKey (u => u.UserId)
                .OnDelete (DeleteBehavior.Restrict);
            modelBuilder.Entity<UpVotedComment> ()
                .HasOne (c => c.Comment)
                .WithMany (u => u.CommentUpVoters)
                .HasForeignKey (c => c.CommentId)
                .OnDelete (DeleteBehavior.Restrict);

        }
    }

}