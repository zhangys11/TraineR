using System;
using System.App.Web.TraineR.Models.Domain;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System.App.Web.TraineR.Services
{
    public static class TerminologyService
    {
        public static string GetReadableStringFromDiagnosisCode(string codes, string lan)
        {
            if(string.IsNullOrWhiteSpace(codes))
            {
                return string.Empty;
            }

            var items = codes.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries).ToList();
            var d001s = items.Where(x => x.StartsWith("D001")).ToList();
            var d001 = d001s.FirstOrDefault();
            if (d001s.Count()>1)
            {
                d001 = d001s.OrderByDescending(x => x.Length).First();
            }
            items.RemoveAll(x => x.StartsWith("D001"));
            if (d001 != null)
            {
                items.Add(d001);
            }
            
            var d002a001s = items.Where(x => x.StartsWith("D002") && x!= "D002").ToList(); // 急性ROP
            if(d002a001s.Count>=1)
            {
                items.RemoveAll(x => x == "D002");
            }
            items.RemoveAll(x => x == "D002.A001.Z" || x == "D002.A001.S" || x == "D002.A001.P");

            var d002a001s004 = items.Where(x => x.StartsWith("D002.A001.S004") && x != "D002.A001.S004").ToList(); // 4A,4B
            if (d002a001s004.Count >= 1)
            {
                items.RemoveAll(x => x == "D002.A001.S004");
            }

            var s = string.Empty;
            items.RemoveAll(x => string.IsNullOrWhiteSpace(x));
            items.Sort(new DiagnosisCodeComparer());

            // always use the default db
            using (var db = new NewbornContainer(lan))
            {
                foreach (var item in items)
                {
                    var entry = db.DiagnosisStandardTermQuery.FirstOrDefault(x => x.Code == item);
                    if(entry!=null)
                    {
                        s += entry.Name + " ";
                    }
                }
            }
            return s;
        }

        protected class DiagnosisCodeComparer : IComparer<string>
        {
            public int Compare(string a, string b)
            {
                if(a.StartsWith("D002.A001.") && b.StartsWith("D002.A001.") && a[10] != b[10])
                {
                    if (a.StartsWith("D002.A001.Z")) return -1;
                    if (a.StartsWith("D002.A001.P")) return 1;
                    if (b.StartsWith("D002.A001.Z")) return 1;
                    if (b.StartsWith("D002.A001.P")) return -1;
                }
                return string.Compare(a,b);
            }
        }

    }
}