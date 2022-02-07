using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace System.App.Web.TraineR.Models.Domain
{
    [Table("Dict_Feeding")]
    public partial class Dict_Feeding
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Pinyin { get; set; }
        public string Code { get; set; }
        public string CodingSystem { get; set; }
    }
    
}
