using System.Web.Mvc;
//using MaxMind.GeoIP2; // Now MaxMind target framework v4.5
//using MaxMind.GeoIP2.Model;
//using MaxMind.GeoIP2.Responses;
using System.App.Web.TraineR.Services;
using System.App.Utility.Helpers;
using System.App.Web.TraineR.Models.Domain;
using System.Web;
using System.Threading;

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
    public class BaseController : System.App.Web.Common.Controllers.BaseController
    {
        protected NewbornContainer domainDBContext = null;
        
        public BaseController()
        {
            ReInitDBContext();
        }

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

        protected void ReInitDBContext()
        {
            this.domainDBContext = new NewbornContainer();
        }
    }
}
