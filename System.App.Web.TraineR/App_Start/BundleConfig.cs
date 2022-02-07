using System.Web;
using System.Web.Optimization;

namespace System.App.Web.ROP
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-{version}.js", // "~/Scripts/jquery-ui-{version}.js",
                        "~/Scripts/jquery.editable-select.js",
                        "~/Scripts/jquery-ui-timepicker-addon.js",
                        "~/Scripts/jquery-dateFormat.js",
                        "~/Scripts/jquery.blockUI.js",
                        "~/Scripts/jquery.dataTables*",
                        "~/Scripts/dataTables.bootstrap.js",
                        "~/Scripts/jquery.form.js",
                        "~/Scripts/jquery.blockUI.js",
                        "~/Scripts/jquery.jeditable.js",
                        "~/Scripts/jquery.multiselect.js",
                        "~/Scripts/jquery.multiselect.zh-cn.js", // i18n for multiselect
                        "~/Scripts/jstree.js",
                        "~/Scripts/utility.tree.js",
                        "~/Scripts/jquery.PrintArea.js",
                        "~/Scripts/jquery.validate*",
                        "~/Scripts/controls.js", // the combobox control
                        "~/Scripts/utility.js", // extended utilities
                        "~/Scripts/utility.autocomplete.js",
                        "~/Scripts/objectDiff.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/leaflet").Include(
                      "~/Scripts/leaflet-1.0.3.js",
                      "~/Scripts/leaflet.editable.js",
                      "~/Scripts/Path.Drag.js",
                      "~/Scripts/Leaflet.fullscreen.js", 
                      "~/Scripts/utility.leaflet.js"));

            bundles.Add(new StyleBundle("~/bundles/css").Include(
                      "~/Styles/bootstrap.css",  // "~/Styles/bootstrap.cerulean.css",
                      "~/Styles/site.css",
                      "~/Styles/jquery-ui.custom.css", // "~/Styles/jquery-ui-1.12.1.css", // "~/Styles/jquery-ui.custom.transparent.css",
                      // "~/Styles/dataTables.jqueryui.css",
                      "~/Styles/dataTables.bootstrap.css",
                      "~/Styles/jquery.editable-select.css",
                      "~/Styles/jquery.multiselect.css",
                      "~/Styles/jstree/themes/default/style.css"));

            bundles.Add(new StyleBundle("~/bundles/leafletcss").Include(
                     "~/Styles/leaflet.css",
                     "~/Styles/leaflet.fullscreen.css"));
        }
    }
}
