using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.App.Model.Enums;
using System.Configuration;
using System.App.Web.TraineR.Models.Domain;
using System.App.Model;

namespace System.App.Web.TraineR.Services
{
    public class MyMembershipProvider: IAccountManage
    {
        // Always use the default db connection for account related operations
        private NewbornContainer db = new NewbornContainer();
        
        public bool Validate(ref AccountViewModel account)
        {
            if (string.IsNullOrEmpty(account.User))
                return false;

            var user = account.User;
            var pwd = account.Password;

            var acc = db.Account.FirstOrDefault(x => x.User == user && x.Password == pwd);
            if (acc != null)
            {
                account.Role = acc.Role;
                return true;
            }

            return false;
        }

        public bool Create(AccountViewModel account, out string error)
        {
            var username = account.User;
            var password = account.Password;

            if (string.IsNullOrEmpty(username))
            {
                error = MembershipCreateStatus.InvalidUserName.ToString();
                return false;
            }
            if (db.Account.Any(x => x.User == username))
            {
                error = MembershipCreateStatus.DuplicateUserName.ToString();
                return false;
            }

            db.Account.Add(new Account() { User = username, Password = password });
            db.SaveChanges();

            error = MembershipCreateStatus.Success.ToString();
            return true;
        }

        public bool ChangePassword(AccountViewModel account, out string error)
        {
            var a = db.Account.FirstOrDefault(x => x.User == account.User);
            if (a == null)
            {
                error = MembershipCreateStatus.InvalidUserName.ToString();
                return false;
            }

            a.Password = account.NewPassword;
            db.SaveChanges();
            error = MembershipCreateStatus.Success.ToString();
            return true;
        }

        public void Seed()
        {
            throw new NotImplementedException();
        }
    }
}