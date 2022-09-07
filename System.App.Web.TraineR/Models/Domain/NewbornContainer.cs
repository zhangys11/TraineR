using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;

namespace System.App.Web.TraineR.Models.Domain
{
    public partial class NewbornContainer : DbContext
    {
        public DbSet<Account> Account { get; set; }
        public DbSet<Dict_Diagnosis> Dict_Diagnosis { get; set; }
        public DbSet<Dict_Modality> Dict_Modality { get; set; }     
        public DbSet<Image> Image { get; set; }
        public DbSet<Concept> Concept { get; set; }
    }
}
