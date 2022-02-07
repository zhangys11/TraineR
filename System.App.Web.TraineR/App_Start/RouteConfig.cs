using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace System.App.Web.ROP
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("favicon.ico"); //http://stackoverflow.com/questions/2109841/im-getting-a-does-not-implement-icontroller-error-on-images-and-robots-txt-in

            //Because everything after "Explorer/" is our path and path contains
            //some slashes and maybe spaces, so we can use "Explorer/{*path}"
            routes.MapRoute(
                name: "Explorer",
                url: "Explorer/{*path}",
                defaults: new
                {
                    controller = "Explorer",
                    action = "Index",
                    path = UrlParameter.Optional
                }
            );

            // default URL: enter quiz page
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Trainer", action = "Quiz", id = UrlParameter.Optional }
            );
        }
    }
}
