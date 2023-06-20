using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.App.Model.Resources;
using System.App.Web.TraineR.Models.Domain;
using System.App.Model.Enums;

namespace System.App.Web.TraineR.Controllers
{
    public class DictDiagnosisController : BaseController
    {
        public ActionResult Index()
        {
            return View(this.domainDBContext.Dict_Diagnosis.ToList());
        }

        #region "CRUD operations"

        /// <summary>
        /// Method called when a row is deleted
        /// </summary>
        /// <param name="id">Id of the entity</param>
        /// <returns>"Success" if delete is successfully performed - any other value will be considered as an error mesage on the client-side</returns>
        public string DeleteData(int id)
        {
            try
            {
                var obj = this.domainDBContext.Dict_Diagnosis.FirstOrDefault(x => x.Id == id);
                if (obj == null)
                {
                    return string.Format(Resource.Message_ItemNotFound, id);
                }

                this.domainDBContext.Dict_Diagnosis.Remove(obj);
                this.domainDBContext.SaveChanges();

                return "success";
            }
            catch (Exception ex)
            {
                return Resource.DeleteFailed + Environment.NewLine + ex.Message;
            }
        }

        /// <summary>
        /// Action that updates data
        /// </summary>
        /// <param name="id">Id of the record</param>
        /// <param name="value">Value that shoudl be set</param>
        /// <param name="rowId">Id of the row</param>
        /// <param name="columnPosition">Position of the column(hidden columns are not counted)</param>
        /// <param name="columnId">Position of the column(hidden columns are counted)</param>
        /// <param name="columnName">Name of the column</param>
        /// <returns>'value's if update suceed - any other value will be considered as an error message on the client-side</returns>
        public string UpdateData(int id, string value, int? rowId, int? columnPosition, int? columnId, string columnName)
        {
            if (string.IsNullOrWhiteSpace(columnName))
            {
                return Resource.SaveFailed + Environment.NewLine + string.Format(ConstFunctionResult.InvalidParameter, "columnName");
            }
            columnName = columnName.Trim();

            if (string.IsNullOrEmpty(value))
                value = string.Empty;

            var obj = this.domainDBContext.Dict_Diagnosis.FirstOrDefault(x => x.Id == id);
            if (obj == null)
            {
                return Resource.SaveFailed + Environment.NewLine + string.Format(Resource.Message_ItemNotFound, id);
            }

            if (columnName == Resource.Name)
            {
                if (string.IsNullOrEmpty(value))
                    return Resource.SaveFailed + Environment.NewLine + string.Format(ConstFunctionResult.InvalidParameter, "value");
                obj.Name = value;
            }
            else if (columnName == Resource.Description)
            {
                obj.Description = value;
            }
            else if (columnName == Resource.Code)
            {
                obj.Code = value;
            }
            else if (columnName == Resource.CodingSystem)
            {
                obj.CodingSystem = value;
            }
            else
            {
                return Resource.SaveFailed + Environment.NewLine + string.Format(ConstFunctionResult.InvalidParameter, "columnName");
            }

            //obj.TimeStamp = DateTime.Now;
            //obj.Author = CurrentUser;
            //obj.Status = EnumItemStatus.Effective.ToString();
            this.domainDBContext.SaveChanges();
            return value; //Resource.SaveSuccess;
        }

        public int AddData(string name, string description, string code, string codingSystem)
        {
            //// judge whether any parameter is null
            //if (string.IsNullOrWhiteSpace(name))
            ////    || string.IsNullOrWhiteSpace(code) || string.IsNullOrWhiteSpace(codingSystem))
            //{
            //    return GlobalSetting.INVALID_ENTITY_ID;  // Resource.SaveFailed + Environment.NewLine + string.Format(Resource.Message_ReflectionError, obj.AssemblyPath, obj.ClassName, obj.MethodName);
            //}

            name = name.Trim();
            code = code.Trim();
            description = description.Trim();
            codingSystem = codingSystem.Trim();

            //if (string.IsNullOrEmpty(name))
            //    return GlobalSetting.INVALID_ENTITY_ID;

            var obj = new Dict_Diagnosis()
            {
                Name = name,
                Code = code,
                Description = description,
                CodingSystem = codingSystem,
            };

            this.domainDBContext.Dict_Diagnosis.Add(obj);
            this.domainDBContext.SaveChanges();

            return obj.Id;
        }
        #endregion

        public ActionResult Seed()
        {
            return View();
        }
    }
}
