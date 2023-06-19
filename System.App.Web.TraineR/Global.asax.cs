using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.App.Model.Enums;
using System.IO;
using System.App.Web.TraineR.Services;
using System.App.Web.Common.Controllers;

namespace System.App.Web.ROP
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            AccountController.AccountManager = new MyMembershipProvider();

            // log4net.Config.XmlConfigurator.Configure();

            // 
            // create the upload folder if not exist
            var folder = Server.MapPath(GlobalSetting.UploadedImageFolder);
            Directory.CreateDirectory(folder);
        }
    }
}
