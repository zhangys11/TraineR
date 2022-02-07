using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace System.App.Web.TraineR.Models.Domain
{
    [Table("Account")]
    public partial class Account
    {
        public int Id { get; set; }
        public string User { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Signature { get; set; }
        public string Repo { get; set; }
        public Nullable<bool> Status { get; set; }
    }
    
}
