using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.App.Model.Enums;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using System.App.Web.TraineR.Services;
using System.App.Web.TraineR.Models.Domain;
using System.Web.UI.WebControls;
using System.App.Utility.Helpers;
using System.Web.UI;
using System.IO;
using System.App.Web.TraineR.Models;
using System.App.Model.Resources;
using System.App.Model;
using Image = System.App.Web.TraineR.Models.Domain.Image;
using System.App.Utility.CAPTCHA;

namespace System.App.Web.TraineR.Controllers
{
    [Authorize] // (Roles = "admin,root,annotator")
    public class TrainerController : BaseController
    {
        //public LogService logger { get; set; }

        public TrainerController()
        {
            //this.logger = new LogService(this.domainDBContext);
        }

        [AllowAnonymous]
        public ActionResult Quiz(string msg="")
        {
            Session["VerificationCode"] = RandomImage.GenerateRandomCode();
            ViewBag.Message = msg;
            return View("QuizEntry");
        }

        /// <summary>
        /// randomly pick n images to generate a quiz        
        /// </summary>
        /// <param name="user"></param>
        /// <param name="code"></param>
        /// <param name="n">question number</param>
        [HttpPost]
        [AllowAnonymous]        
        public ActionResult Quiz(string user, string code)
        {
            //    if (string.IsNullOrWhiteSpace(token))
            //    {
            //        return Json(new
            //        {
            //            message = Resource.TokenMissing
            //        }, JsonRequestBehavior.AllowGet);
            //    }

            //    var decrypted = XorEncryptor.Decrypt(token);
            //    if (DateTime.Now.ToString("yyyyMMdd") != decrypted &&
            //        DateTime.Now.AddDays(1).ToString("yyyyMMdd") != decrypted)
            //    {
            //        return Json(new
            //        {
            //            message = Resource.TokenUnmatched
            //        }, JsonRequestBehavior.AllowGet);
            //    }

            if (Session["VerificationCode"] == null)
            {
                ModelState.AddModelError("", Resource.PageExpired);
                return RedirectToAction("Quiz", "Trainer", new { msg = Resource.PageExpired });
            }

            if (code.ToLower() != Session["VerificationCode"].ToString().ToLower())
            {
                ModelState.AddModelError("", Resource.ImageVerificationCodeError);
                return RedirectToAction("Quiz", "Trainer", new { msg = Resource.ImageVerificationCodeError });
            }

            return View("Train");
        }

        [AllowAnonymous]
        public ActionResult QuizInner(string token, string labelcode="", int n = 10)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return Json(new
                {
                    message = Resource.TokenMissing
                }, JsonRequestBehavior.AllowGet);
            }

            var decrypted = XorEncryptor.Decrypt(token);
            if (DateTime.Now.ToString("yyyyMMdd") != decrypted &&
                DateTime.Now.AddDays(1).ToString("yyyyMMdd") != decrypted)
            {
                return Json(new
                {
                    message = Resource.TokenUnmatched
                }, JsonRequestBehavior.AllowGet);
            }

            List<Image> imgs = null;           

            if (string.IsNullOrWhiteSpace(labelcode) || labelcode == "all")
            {
                var rnd = new Random();
                var grps = this.domainDBContext.FundusImageForQuizQuery.GroupBy(x => x.LabelCode, (k, v) => new { key = k, a = v.Select(y => y.Id).ToList(), c = v.Count() }).ToList().OrderBy(x => rnd.Next()).ToList(); // scramble groups

                var total = this.domainDBContext.FundusImageForQuizQuery.Count();
                var ids = new List<int>();
                
                if(n > total)
                {
                    n = total;
                }

                int loops = 0;
                while(ids.Count()<=n)
                {           
                    if (loops++ > n * 10) // considering the repition due to randomness, we allow max 10*n loops.
                    {
                        break;
                    }

                    foreach(var grp in grps)
                    {
                        if (grp.a.Count() > 0)
                        {
                            var id = grp.a.OrderBy(x => rnd.Next()).First();
                            if (ids.Contains(id) == false)
                            {
                                ids.Add(id);
                            }
                        }
                    }
                }

                var arr_ids = ids.ToArray();
                imgs = this.domainDBContext.FundusImageForQuizQuery.Where(x=> arr_ids.Contains(x.Id)).ToList().OrderBy(x => rnd.Next()).ToList();

                //var total = this.domainDBContext.FundusImageForQuizQuery.Count();
                //var skip = rnd.Next(0, total - n);
                ////var imgs = this.domainDBContext.FundusImageQuery.OrderBy(x => rnd.Next()).Take(n).ToList();
                //imgs = this.domainDBContext.FundusImageForQuizQuery.OrderBy(x => x.Id).Skip(skip).Take(n).ToList();

                ViewBag.Candidates = this.domainDBContext.FundusImageForQuizQuery.Select(x => x.LabelCode).Distinct().ToList();
            }
            else
            {
                imgs = this.domainDBContext.FundusImageForQuizQuery.Where(x => x.LabelCode == labelcode).ToList();

                ViewBag.LabelCode = labelcode;
            }
                       

            return View("Quiz", imgs);
        }


        #region Backend Maintenance

        public ActionResult Index(bool showAll = true)
        {
            // ViewBag.Message = "The last modified image has been successfully loaded.";
            string user = User.Identity.Name;

            // by default, open the latest modified image
            var lastModified = domainDBContext.Image.Where(x =>x.Deleted!=null && x.Editor == user).OrderByDescending(x => x.TimeStamp).FirstOrDefault();

            ViewBag.ShowAll = showAll;
            return View("Edit", lastModified);
        }


        [ChildActionOnly]
        public PartialViewResult List(bool showAll = true)
        {
            ViewBag.ShowAll = showAll;
            return PartialView();
        }

        public ActionResult ImageView(int id)
        {
            var instance = domainDBContext.Image.Find(id);
            if (instance == null)
                return Content("<span>" + string.Format(Resource.Message_ItemNotFound, id) + "</span>");

            return PartialView("Image", instance);
        }

        public ActionResult Thumbnail(string filename, int width = 36, int height = 24)
        {
            return File(ImageHelper.GetThumbnail(filename), "image/png");
        }

        public ActionResult SubsetImageTableAjaxHandler(JQueryDataTableParamModel param)
        {
            return ImageTableAjaxHandlerInternal(param, true);
        }

        public ActionResult FullsetImageTableAjaxHandler(JQueryDataTableParamModel param)
        {
            return ImageTableAjaxHandlerInternal(param, false);
        }

        public ActionResult ImageTableAjaxHandlerInternal(JQueryDataTableParamModel param, bool subset = true)
        {
            IQueryable<Image> source = this.domainDBContext.FundusImageForQuizQuery;
            if (subset)
            {
                // source = source.Where(x => x.Editor == CurrentUser);
            }
            IQueryable<Image> filtered = null;
            //Check whether entities should be filtered by keyword
            if (!string.IsNullOrEmpty(param.sSearch))
            {
                filtered = source
                   .Where(c =>
                    c.Label != null && c.Label.ToLower().Contains(param.sSearch.ToLower()) ||
                    c.LabelCode != null && c.LabelCode.ToLower().Contains(param.sSearch.ToLower()) ||
                    param.sSearch.Length > 4 /*Avoid too many irrelavent results*/ && c.Type != null && c.Type.ToLower().Contains(param.sSearch.ToLower())
                  ).OrderByDescending(x => x.Id); //.OrderBy(x => SqlFunctions.DataLength(x.Name));
            }
            else
            {
                filtered = source.OrderByDescending(x => x.Id);
            }

            var displayed = filtered.Skip(param.iDisplayStart).Take(param.iDisplayLength);
            var result = from c in displayed.ToList()
                         select (new[]{
                             c.Id.ToString(),
                             c.Name??string.Empty,
                             c.Label??string.Empty,
                             c.LabelCode??string.Empty,
                             string.Empty, // c.ImageFileName,
                             c.URL,
                             c.Link,
                             c.ThumbnailForView,
                             c.TimeStamp.HasValue?c.TimeStamp.Value.ToString("yyyy/MM/dd"):  Resource.Unlabelled,
                             c.Editor,
                             string.Empty,
                         }); // arrange all visible columns in the front

            return Json(new
            {
                sEcho = param.sEcho,
                iTotalRecords = source.Count(),
                iTotalDisplayRecords = filtered.Count(),
                aaData = result
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Create()
        {
            return View("Edit", new Image());
        }

        public ActionResult Edit(int id)
        {
            var instance = domainDBContext.Image.Find(id);
            if (instance == null)
                return RedirectToAction("Error", "Home", new { message = string.Format(Resource.Message_ItemNotFound, id) });

            return View(instance);
        }

        public ActionResult Delete(int id)
        {
            if (GlobalSetting.DemoMode || User.Identity.Name == GlobalSetting.WEBPORTAL_USER_DEMO)
            {
                return RedirectToAction("Error", "Debug", new { message = Resource.Message_DemoUserWarn });
            }

            var instance = domainDBContext.Image.Find(id);
            if (instance == null)
                return RedirectToAction("Error", "Debug", new { message = string.Format(Resource.Message_ItemNotFound, id) });

            domainDBContext.DeleteImage(id);
            return RedirectToAction("Index");
        }

        [HttpPost]
        public string Edit(Image instance)
        {
            if (GlobalSetting.DemoMode || User.Identity.Name == GlobalSetting.WEBPORTAL_USER_DEMO)
            {
                return new JavaScriptSerializer().Serialize(new[] { string.Format(Resource.Message_Exception, Resource.Message_DemoUserWarn) });
            }

            try
            {
                if (ModelState.IsValid)
                {
                    if (instance.Id == GlobalSetting.UNINITIALIZED_ENTITY_ID) // create
                    {
                        domainDBContext.Image.Add(instance);
                    }
                    else
                    {
                        domainDBContext.Entry(instance).State = System.Data.Entity.EntityState.Modified;
                    }
                    instance.TimeStamp = DateTime.Now;
                    instance.Deleted = false;
                    if (User != null && User.Identity != null)
                        instance.Editor = User.Identity.Name;
                    domainDBContext.SaveChanges();

                    // Log(string message, string source, string type = null, string logLevel = null)
                    // logger.log("GalleryController.Edit", instance.ImageFilePath, instance.LabelCode, instance.Label, instance.Annotation, instance.Editor);

                    return new JavaScriptSerializer().Serialize(new[] { Resource.SaveSuccess, instance.Id.ToString(), instance.TimeStamp.ToString() });
                }
                return new JavaScriptSerializer().Serialize(new[] { string.Format(Resource.Message_Exception, ModelStateHelper.GetErrors(ModelState)) });
            }
            catch (Exception ex)
            {
                return new JavaScriptSerializer().Serialize(new[] { string.Format(Resource.Message_Exception, ex.Message) });
            }
        }


        public ActionResult Summary()
        {
            // image distributions, group by position, diagnose, age, gender, etc ...
            return View();
        }


        public ActionResult Import()
        {
            return View();
        }

        #endregion

        public JsonResult GetReadableStringFromLabelCode(string code)
        {
            return Json(TerminologyService.GetReadableStringFromDiagnosisCode(code), JsonRequestBehavior.AllowGet);
        }


        public ActionResult Seed()
        {
            return View();
        }

        public ActionResult SeedQuiz()
        {
            return View();
        }

        public ActionResult UpdateTags()
        {
            return View();
        }

        /// <summary>
        /// 根据DL分类器设置正确的图片类型。Fundus或NonFundus
        /// </summary>
#if DEBUG
        [AllowAnonymous]
#else
        [Authorize]
#endif
        public ActionResult UpdateImageTypes()
        {
            return View();
        }


        /// <summary>
        /// 清理无效的Image对象
        /// </summary>
#if DEBUG
        [AllowAnonymous]
#else
    [Authorize]
#endif
        public ActionResult FilterInvalidImages()
        {
            return View();
        }

        public ActionResult Backend()
        {
            return View();
        }

        public ActionResult Wiki()
        {
            return View();
        }

        public ActionResult Version()
        {
            return View();
        }
    }
}