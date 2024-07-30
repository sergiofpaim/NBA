using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace NBA.Models;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Game> Games { get; set; }

    public virtual DbSet<Participation> Participations { get; set; }

    public virtual DbSet<Play> Plays { get; set; }

    public virtual DbSet<Player> Players { get; set; }

    public virtual DbSet<Scalation> Scalations { get; set; }

    public virtual DbSet<Season> Seasons { get; set; }

    public virtual DbSet<Selection> Selections { get; set; }

    public virtual DbSet<Team> Teams { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=NOTE-SFP;Database=Basketball;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Game__3214EC077B876AAC");

            entity.ToTable("Game");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.At).HasColumnType("datetime");
            entity.Property(e => e.HomeTeamId)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.SeasonId)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.VisitorTeamId)
                .HasMaxLength(3)
                .IsUnicode(false);

            entity.HasOne(d => d.Scalation).WithMany(p => p.GameScalations)
                .HasForeignKey(d => new { d.SeasonId, d.HomeTeamId })
                .HasConstraintName("FK_HomeTeamId_TeamId");

            entity.HasOne(d => d.ScalationNavigation).WithMany(p => p.GameScalationNavigations)
                .HasForeignKey(d => new { d.SeasonId, d.VisitorTeamId })
                .HasConstraintName("FK_VisitorTeamId_TeamId");
        });

        modelBuilder.Entity<Participation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Particip__3214EC07E50401A3");

            entity.ToTable("Participation");

            entity.HasIndex(e => new { e.SelectionId, e.GameId, e.Quarter }, "UC_Participation").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.Game).WithMany(p => p.Participations)
                .HasForeignKey(d => d.GameId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Participation_GameId");

            entity.HasOne(d => d.Selection).WithMany(p => p.Participations)
                .HasForeignKey(d => d.SelectionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Participation_SelectionId");
        });

        modelBuilder.Entity<Play>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Play__3214EC07CCACF031");

            entity.ToTable("Play");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Player>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Player__3214EC07AFB810B2");

            entity.ToTable("Player");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Position)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Scalation>(entity =>
        {
            entity.HasKey(e => new { e.SeasonId, e.TeamId });

            entity.ToTable("Scalation");

            entity.Property(e => e.SeasonId)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.TeamId)
                .HasMaxLength(3)
                .IsUnicode(false);

            entity.HasOne(d => d.Season).WithMany(p => p.Scalations)
                .HasForeignKey(d => d.SeasonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Scalation_Season");

            entity.HasOne(d => d.Team).WithMany(p => p.Scalations)
                .HasForeignKey(d => d.TeamId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Scalation_Team");
        });

        modelBuilder.Entity<Season>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Season__3214EC07D1F15408");

            entity.ToTable("Season");

            entity.Property(e => e.Id)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<Selection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Selectio__3214EC07D78CF3E5");

            entity.ToTable("Selection");

            entity.HasIndex(e => new { e.PlayerId, e.SeasonId, e.TeamId }, "UC_Selection").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.SeasonId)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.TeamId)
                .HasMaxLength(3)
                .IsUnicode(false);

            entity.HasOne(d => d.Player).WithMany(p => p.Selections)
                .HasForeignKey(d => d.PlayerId)
                .HasConstraintName("FK_Selection_PlayerId");

            entity.HasOne(d => d.Scalation).WithMany(p => p.Selections)
                .HasForeignKey(d => new { d.SeasonId, d.TeamId })
                .HasConstraintName("FK_Selection_TeamId_SeasonId");
        });

        modelBuilder.Entity<Team>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Team__3214EC076ABD68CF");

            entity.ToTable("Team");

            entity.Property(e => e.Id)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Conference)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Stadium)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.State)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
