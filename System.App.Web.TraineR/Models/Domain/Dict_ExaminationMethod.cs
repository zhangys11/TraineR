using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace System.App.Web.TraineR.Models.Domain
{
    [Table("Dict_ExaminationMethod")]
    public partial class Dict_ExaminationMethod
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string CodingSystem { get; set; }
    }
    
}
