using System.Web.Mvc;
//using MaxMind.GeoIP2; // Now MaxMind target framework v4.5
//using MaxMind.GeoIP2.Model;
//using MaxMind.GeoIP2.Responses;
using System.App.Web.TraineR.Services;
using System.App.Utility.Helpers;
using System.App.Web.TraineR.Models.Domain;
using System.Web;
using System.Threading;
using System.App.Model.Resources;

namespace System.App.Web.TraineR.Controllers
{
    /// <summary>
    /// Defines the base controller.
    /// </summary>
    /// <remarks>
    /// This is the base class for all site's controllers.
    /// Upon db deployment, access /Account/Register to register account into ASP.Net db.
    /// </remarks>
#if DEBUG
    [AllowAnonymous]
#else
    [Authorize]
#endif
    public class BaseController: Controller // : System.App.Web.Common.Controllers.BaseController
    {
        protected NewbornContainer domainDBContext = null;

        /// <remarks>
        /// In controller's construtor, we cannot get cookie because Request is null. 
        /// So we do it in BeginExecuteCore override. 
        /// </remarks>
        public BaseController()
        {
            // HttpCookie cultureCookie = Request.Cookies["_culture"];
            // this.domainDBContext = new NewbornContainer(Resource.lan or cultureCookie.Value); // don't work  
        }

        #region i18n


        /// <remarks>http://afana.me/post/aspnet-mvc-internationalization.aspx</remarks>
        protected override IAsyncResult BeginExecuteCore(AsyncCallback callback, object state)
        {
            string cultureName = null;

            // Attempt to read the culture cookie from Request
            HttpCookie cultureCookie = Request.Cookies["_culture"];
            if (cultureCookie != null)
                cultureName = cultureCookie.Value;
            else
                cultureName = Request.UserLanguages != null && Request.UserLanguages.Length > 0 ?
                        Request.UserLanguages[0] :  // obtain it from HTTP header AcceptLanguages
                        null;
            // Validate culture name
            cultureName = CultureHelper.GetImplementedCulture(cultureName); // This is safe

            // Modify current thread's cultures            
            Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(cultureName);
            Thread.CurrentThread.CurrentUICulture = Thread.CurrentThread.CurrentCulture;

            //
            // We add this section to support mulit-lan db.
            // For ordinary mulit-lan resx, just use the BaseController in System.App.Web.Common. 
            string lan = "en";
            foreach (var lancode in new string[] { "cn","jp","en" })
            {
                if (cultureName.ToLower().Contains(lancode)){
                    lan = lancode;
                    break;
                }
            }
            this.domainDBContext = new NewbornContainer(lan);


            return base.BeginExecuteCore(callback, state);
        }

        #endregion

        /// <summary>
        /// Dispose the used resource.
        /// </summary>
        /// <param name="disposing">The disposing flag.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                // managed resource
                if (this.domainDBContext != null)
                {
                    this.domainDBContext.Dispose();
                    this.domainDBContext = null;
                }

                // unmanaged resource
                // ...
            }

            // If it is available, make the call to the
            // base class's Dispose(Boolean) method
            base.Dispose(disposing);
        }

        ~BaseController()
        {
            // Finalizer calls Dispose(false)
            Dispose(false);
        }
    }
}
