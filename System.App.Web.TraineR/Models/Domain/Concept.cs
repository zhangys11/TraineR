using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace System.App.Web.TraineR.Models.Domain
{
    [Table("Concept")]
    public partial class Concept
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Alias1 { get; set; }
        public string Alias2 { get; set; }
        public string Alias3 { get; set; }
        public string Alias4 { get; set; }
        public string Alias5 { get; set; }
        public string Code { get; set; }
        public string CodingSystem { get; set; }
        public string Code1 { get; set; }
        public string CodingSystem1 { get; set; }
        public string Code2 { get; set; }
        public string CodingSystem2 { get; set; }
        public string Code3 { get; set; }
        public string CodingSystem3 { get; set; }
    }
    
}
