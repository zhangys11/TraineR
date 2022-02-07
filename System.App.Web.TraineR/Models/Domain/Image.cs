using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace System.App.Web.TraineR.Models.Domain
{
    [Table("Image")]
    public partial class Image
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Nullable<System.DateTime> TimeStamp { get; set; }
        public string Editor { get; set; }
        public string ImageFilePath { get; set; }
        public string Link { get; set; }
        public string Type { get; set; }
        public string Thumbnail { get; set; }
        public string Comment { get; set; }
        public string Label { get; set; }
        public string LabelCode { get; set; }
        public string Annotation { get; set; }
        public string Position { get; set; }
        public string Inference { get; set; }
        public string Inference1 { get; set; }
        public string Inference2 { get; set; }
        public string Inference3 { get; set; }
        public string Inference4 { get; set; }
        public string Inference5 { get; set; }
        public string Inference6 { get; set; }
        public string Inference7 { get; set; }
        public string Inference8 { get; set; }
        public string Inference9 { get; set; }
        public string GroundTruth { get; set; }
        public string GroundTruth1 { get; set; }
        public string GroundTruth2 { get; set; }
        public string GroundTruth3 { get; set; }
        public string GroundTruth4 { get; set; }
        public string GroundTruth5 { get; set; }
        public string GroundTruth6 { get; set; }
        public string GroundTruth7 { get; set; }
        public string GroundTruth8 { get; set; }
        public string GroundTruth9 { get; set; }
        public Nullable<bool> Deleted { get; set; }
        public Nullable<bool> Tag01 { get; set; }
        public Nullable<bool> Tag02 { get; set; }
        public Nullable<bool> Tag03 { get; set; }
        public Nullable<bool> Tag04 { get; set; }
        public Nullable<bool> Tag05 { get; set; }
        public Nullable<bool> Tag06 { get; set; }
        public Nullable<bool> Tag07 { get; set; }
        public Nullable<bool> Tag08 { get; set; }
        public Nullable<bool> Tag09 { get; set; }

        //public virtual Visit Visit { get; set; }        
    }
    
}
