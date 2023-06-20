using System;
using System.App.Model.Enums;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.App.Model.Resources;
using System.App.Utility.Helpers;
using System.IO;

namespace System.App.Web.TraineR.Models.Domain
{
    public partial class NewbornContainer
    {
        /// <summary>
        /// Dyanmically use specific language version database.
        /// </summary>
        /// <remarks>
        /// Thread.CurrentThread.CurrentUICulture does not work. We use Resource.lan
        /// </remarks>
        public NewbornContainer(string lan):base("name=quizbank." + lan) { }

        public NewbornContainer() : base("name=quizbank.en") { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            //modelBuilder.Conventions.Remove<PluralizingEntitySetNameConvention>();
            //modelBuilder.Entity<Newborn>().ToTable("Newborn"); // default table name is xxxSet
            base.OnModelCreating(modelBuilder);
        }

        

        /// <summary>
        /// Only return images that are not deleted
        /// </summary>
        public IQueryable<Image> ImageQuery
        {
            get
            {
                return this.Image.Where(x => x.Deleted != true);
            }
        }

        public IQueryable<Image> FundusImageQuery
        {
            get
            {
                return this.ImageQuery.Where(x => x.Type == "眼底彩照" || x.Type == "fundus" || x.Type != null && x.Type.Contains("RetCam"));
            }
        }


        public IQueryable<Image> FundusImageForQuizQuery
        {
            get
            {
                return this.FundusImageQuery.Where(x => x.Tag06 == true);
            }
        }

        public IQueryable<Dict_Diagnosis> DiagnosisStandardTermQuery
        {
            get
            {
                return this.Dict_Diagnosis.Where(x => x.CodingSystem == "ROP_MST");
            }
        }

        public IQueryable<Dict_Diagnosis> DiagnosisPrivateTermQuery
        {
            get
            {
                return this.Dict_Diagnosis.Where(x => x.CodingSystem != "ROP_MST");
            }
        }

        /// <summary>
        /// Import images from a directory to database
        /// </summary>
        /// <param name="dir_path">physical directory with images</param>
        /// <param name="serve_dir_path">relative URL the server will serve the imags</param>
        /// <returns>A list of successfully import images. Duplicate or already-existing images are omitted.</returns>
        public List<Image> ImportImages(string dir_path, string serve_dir_path)
        {
            var imgList = new List<Image>();
            var prefix = GlobalSetting.ThumbnailPrefix;

            foreach (var fn in new DirectoryInfo(dir_path).EnumerateFiles())
            {
                var label = new DirectoryInfo(dir_path).Name;
                var dict_item = DiagnosisStandardTermQuery.FirstOrDefault(x=>x.Name == label);
                var code = "";
                var comment = "";
                if (dict_item != null)
                {
                    code = dict_item.Code;
                    comment = dict_item.Description;
                }

                var g = new Image();
                var g60 = Base64Convertor.GetDataURLForImageThumbnail(fn.FullName, 60, 45, true, false, 10);

                g.LabelCode = code;
                g.Label = label;
                g.Tag06 = true; // 包含到培训系统题库v

                var md5 = DigestGenerator.GetMD5(fn.FullName);
                File.Move(fn.FullName, dir_path + md5 + Path.GetExtension(fn.Name)); // rename file by MD5

                g.Description = fn.FullName; // source path
                g.ImageFilePath = serve_dir_path + "/" + label + "/" + md5 + Path.GetExtension(fn.Name);
                g.Name = md5;
                g.Type = "fundus";
                g.Comment = comment;

                //
                // Base64 is redundant. Remove common prefix to save storage space
                if (g60.StartsWith(prefix))
                {
                    g.Thumbnail = g60.Replace(prefix, "");
                }
                else
                {
                    g.Thumbnail = g60;
                }

                if (this.Image.FirstOrDefault(x => x.Name == g.Name) == null)
                {
                    this.Image.Add(g);
                    imgList.Add(g);
                    this.SaveChanges();
                }                
            }

            return imgList;
        }

        public void DeleteImage(int id)
        {
            var instance = this.Image.Find(id);
            if (instance != null)
            {
                instance.Deleted = true;
                this.Entry(instance).State = System.Data.Entity.EntityState.Modified;
                this.SaveChanges();
            }
        }

    }
}