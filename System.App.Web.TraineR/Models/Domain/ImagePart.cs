using System;
using System.App.Model.Enums;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace System.App.Web.TraineR.Models.Domain
{
    public partial class Image
    {
        [NotMapped]
        public string ThumbnailForView { 
            get 
            {
                if(string.IsNullOrWhiteSpace(this.Thumbnail) == false && this.Thumbnail.StartsWith("data:image/") == false)
                {
                    return GlobalSetting.ThumbnailPrefix + this.Thumbnail;
                }
                return this.Thumbnail;
            } 
        }

        [NotMapped]
        public string URL
        {
            get
            {
                if (string.IsNullOrWhiteSpace(this.ImageFilePath))
                {
                    return string.Empty;
                }

                if (this.ImageFilePath.ToLower().StartsWith("http"))
                {
                    return this.ImageFilePath;
                }

                if (this.ImageFilePath.StartsWith(GlobalSetting.UploadedImageFolder))
                {
                    return this.ImageFilePath;
                }

                return GlobalSetting.UploadedImageFolder + this.ImageFilePath;
            }
        }
    }    
}
