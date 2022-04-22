using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Diagnostics;
using System.App.Model.Resources;
using System.App.Web.TraineR.Models.Domain;
using System.App.Utility.Helpers;
using System.Threading;
using System.Web.Security;

namespace System.App.Web.TraineR.Controllers
{
    [AllowAnonymous]
    public class HomeController : BaseController
    {        
        /// <summary>
        /// After login or logout, it will redirect to this URL 
        /// </summary>
        public ActionResult Index()
        {            
            return RedirectToAction("Index", "Trainer");
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult Error(string message)
        {
            ViewBag.Message = message;
            return View();
        }

        [Authorize]
        public ActionResult Backend()
        {
            return View();
        }

        public ActionResult Version()
        {
            return View();
        }

        public ActionResult Wiki()
        {
            return View();
        }               

        public ActionResult Terminology()
        {
            return View();
        }

        public ActionResult FundusImageClassifier()
        {
            return View();
        }
    }
}
