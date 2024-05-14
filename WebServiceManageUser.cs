using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
/// <summary>
/// Summary description for WebServiceManageUser
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class WebServiceManageUser : System.Web.Services.WebService
{
    private string keyValue = "RCV";
    public WebServiceManageUser()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    public string RCVEncPwd(string password)
    {
        string encryptPassword = password + keyValue;
        byte[] passwordBytes = Encoding.UTF8.GetBytes(encryptPassword);

        HashAlgorithm hash = new MD5CryptoServiceProvider();
        byte[] hashBytes = hash.ComputeHash(passwordBytes);

        encryptPassword = Convert.ToBase64String(passwordBytes);
        return encryptPassword;
    }
    public string RCVDecPwd(string password)
    {
        string originalPassword = "";
        byte[] inputByteArray = Convert.FromBase64String(password);

        originalPassword = Encoding.UTF8.GetString(inputByteArray);

        return originalPassword.Substring(0,
        originalPassword.Length - keyValue.Length);
    }

    public class manageuser
    {
        public string id;
        public string name;
        public string userName;
        public string password;
        public string passwordHash;
        public string email;
        public string phoneNumber;
        public string groups_id;
        public string idCongTrinhCapNuoc;
        public string description;
        public DateTime NgayUpdate;
        public string NguoiUpdate;

        public DateTime NgayCreate;
        public string NguoiCreate;


    }


    [WebMethod]
    public void List(string tenQuyenLoggedIn)
    {
        ClassTTNBT classTT = new ClassTTNBT();
        SqlConnection conn = classTT.CreateConnectionGis();
        // lấy permission trước
        DataTable dtMenuID = new DataTable();
        List<manageuser> listManageUser = new List<manageuser>();

        string sqlQuery = "";
        // điều kiện nếu user đăng nhập có quyền là moderator hay moderatorSub thì 
        if (tenQuyenLoggedIn == "moderator" || tenQuyenLoggedIn == "moderatorSub")
        {
            sqlQuery = " SELECT u.* " +
                       " FROM users u INNER JOIN groups g ON u.groups_id = g.id " +
                       " WHERE u.Active = 'T' AND(g.name = 'user' OR g.name = 'userSub')";
        }
        else // điều kiện nếu user đăng nhập có quyền khác mod thì chỉ còn admin có quyenLoggedIn == "1", do user ko hiện trang này
        {
            sqlQuery = "SELECT * FROM users WHERE Active = 'T' ";
        }


        dtMenuID = classTT.GetDataTable_Cmd(sqlQuery);
        for (int i = 0; i < dtMenuID.Rows.Count; i++)
        {
            manageuser newManageUser = new manageuser();

            newManageUser.id = (dtMenuID.Rows[i]["id"].ToString());
            newManageUser.name = (dtMenuID.Rows[i]["name"].ToString());
            newManageUser.userName = (dtMenuID.Rows[i]["userName"].ToString());
            newManageUser.password = (dtMenuID.Rows[i]["password"].ToString());
            newManageUser.passwordHash = (dtMenuID.Rows[i]["passwordHash"].ToString());
            newManageUser.email = (dtMenuID.Rows[i]["email"].ToString());
            newManageUser.phoneNumber = (dtMenuID.Rows[i]["phoneNumber"].ToString());
            newManageUser.groups_id = (dtMenuID.Rows[i]["groups_id"].ToString());
            newManageUser.idCongTrinhCapNuoc = (dtMenuID.Rows[i]["idCongTrinhCapNuoc"].ToString());
            newManageUser.description = (dtMenuID.Rows[i]["description"].ToString());

            newManageUser.NgayUpdate = DateTime.Parse(dtMenuID.Rows[i]["NgayUpdate"].ToString());
            newManageUser.NguoiUpdate = (dtMenuID.Rows[i]["NguoiUpdate"].ToString());

            newManageUser.NgayCreate = DateTime.Parse(dtMenuID.Rows[i]["NgayCreate"].ToString());
            newManageUser.NguoiCreate = (dtMenuID.Rows[i]["NguoiCreate"].ToString());

            listManageUser.Add(newManageUser);
        }

        string json = JsonConvert.SerializeObject(listManageUser);

        HttpContext.Current.Response.ContentType = "application/json; charset=utf-8";
        HttpContext.Current.Response.Write(json);

    }



    [WebMethod]
    public void Create(string userLoggedIn, string idUsersLoggedIn, string listInsertedRow, string listUpdatedRow, string listRemovedRow)
    {
        // deserializer chuỗi(string) thành object lại
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var listManageUserInserted = serializer.Deserialize<List<manageuser>>(listInsertedRow);
        ClassTTNBT classTT = new ClassTTNBT();

        // Insert các Row đã Insert vào trong database
        for (int i = 0; i < listManageUserInserted.Count; i++)
        {
            string query = "INSERT INTO dbo.users (name, userName, password, passwordHash, email, phoneNumber, groups_id, idCongTrinhCapNuoc, description, NgayUpdate, NguoiUpdate, Active, NgayCreate, NguoiCreate) VALUES(@name, @userName, @password, @passwordHash, @email, @phoneNumber, @groups_id, @idCongTrinhCapNuoc, @description, @NgayUpdate, @NguoiUpdate, @Active, @NgayCreate, @NguoiCreate)";
            using (SqlConnection sqlConnection = classTT.CreateConnectionGis())
            {
                using (SqlCommand cmd = new SqlCommand(query))
                {
                    cmd.Parameters.AddWithValue("@name", listManageUserInserted[i].name);
                    cmd.Parameters.AddWithValue("@userName", listManageUserInserted[i].userName);
                    cmd.Parameters.AddWithValue("@passWord", listManageUserInserted[i].password);

                    cmd.Parameters.AddWithValue("@passWordHash", RCVEncPwd(listManageUserInserted[i].password).ToString());

                    cmd.Parameters.AddWithValue("@email", listManageUserInserted[i].email);
                    cmd.Parameters.AddWithValue("@phoneNumber", listManageUserInserted[i].phoneNumber);
                    cmd.Parameters.AddWithValue("@groups_id", listManageUserInserted[i].groups_id);
                    //if (listManageUserInserted[i].idCongTrinhCapNuoc != null)
                    //{
                    //    cmd.Parameters.AddWithValue("@idCongTrinhCapNuoc", listManageUserInserted[i].idCongTrinhCapNuoc);
                    //}
                    //else // có thể cái này dư vì trên client đã bắt idCongTrinhCapNuoc not null
                    //{
                        cmd.Parameters.AddWithValue("@idCongTrinhCapNuoc", 40); // đang insert vào id của trung tâm nước
                    //}
                    cmd.Parameters.AddWithValue("@description", listManageUserInserted[i].description);

                    cmd.Parameters.AddWithValue("@NgayUpdate", listManageUserInserted[i].NgayUpdate);
                    // đáng lẽ NguoiUpdate cũng đưa vào idUsersLoggedIn chứ ko phải userLoggedIn
                    // nhưng đã lỡ có dữ liệu rồi sữa ko được nữa
                    cmd.Parameters.AddWithValue("@NguoiUpdate", userLoggedIn);
                    cmd.Parameters.AddWithValue("@Active", "T");

                    cmd.Parameters.AddWithValue("@NgayCreate", listManageUserInserted[i].NgayUpdate);
                    cmd.Parameters.AddWithValue("@NguoiCreate", idUsersLoggedIn);

                    cmd.Connection = sqlConnection;
                    sqlConnection.Open();
                    cmd.ExecuteNonQuery();
                    sqlConnection.Close();
                }
            }
        }// end for listManageUserInserted


    }// end Create function

    [WebMethod]
    public void Update(string userLoggedIn, string idUsersLoggedIn, string listInsertedRow, string listUpdatedRow, string listRemovedRow)
    {
        // deserializer chuỗi(string) thành object lại
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var listManageUserRow = serializer.Deserialize<List<manageuser>>(listUpdatedRow);
        ClassTTNBT classTT = new ClassTTNBT();
        // Tạo 2 List riêng các Row Inserted và Updated cho dễ phân biệt 
        List<manageuser> listManageUserInserted = new List<manageuser>();
        List<manageuser> listManageUserUpdated = new List<manageuser>();

        Regex regex = new Regex(@"[a-zA-Z]");
        for (int i = 0; i < listManageUserRow.Count; i++)
        {
            if (regex.IsMatch(listManageUserRow[i].id))
            {
                listManageUserInserted.Add(listManageUserRow[i]);
            }
            else
            {
                listManageUserUpdated.Add(listManageUserRow[i]);
            }
        }


        // Insert các Row đã Insert vào trong database
        for (int i = 0; i < listManageUserInserted.Count; i++)
        {
            string query = "INSERT INTO dbo.users (name, userName, password, passwordHash, email, phoneNumber, groups_id, idCongTrinhCapNuoc, description, NgayUpdate, NguoiUpdate, Active, NgayCreate, NguoiCreate) VALUES(@name, @userName, @password, @passwordHash, @email, @phoneNumber, @groups_id, @idCongTrinhCapNuoc, @description, @NgayUpdate, @NguoiUpdate, @Active, @NgayCreate, @NguoiCreate)";
            using (SqlConnection sqlConnection = classTT.CreateConnectionGis())
            {
                using (SqlCommand cmd = new SqlCommand(query))
                {

                    cmd.Parameters.AddWithValue("@name", listManageUserInserted[i].name);
                    cmd.Parameters.AddWithValue("@userName", listManageUserInserted[i].userName);
                    cmd.Parameters.AddWithValue("@passWord", listManageUserInserted[i].password);
                    cmd.Parameters.AddWithValue("@passwordHash", RCVEncPwd(listManageUserInserted[i].password).ToString());

                    cmd.Parameters.AddWithValue("@email", listManageUserInserted[i].email);
                    cmd.Parameters.AddWithValue("@phoneNumber", listManageUserInserted[i].phoneNumber);
                    cmd.Parameters.AddWithValue("@groups_id", listManageUserInserted[i].groups_id);
                    //if (listManageUserInserted[i].idCongTrinhCapNuoc != null)
                    //{
                    //    cmd.Parameters.AddWithValue("@idCongTrinhCapNuoc", listManageUserInserted[i].idCongTrinhCapNuoc);
                    //}
                    //else // có thể cái này dư vì trên client đã bắt idCongTrinhCapNuoc not null
                    //{
                        cmd.Parameters.AddWithValue("@idCongTrinhCapNuoc", 40);
                    //}
                    cmd.Parameters.AddWithValue("@description", listManageUserInserted[i].description);
                    cmd.Parameters.AddWithValue("@NgayUpdate", listManageUserInserted[i].NgayUpdate);
                    // đáng lẽ NguoiUpdate cũng đưa vào idUsersLoggedIn chứ ko phải userLoggedIn
                    // nhưng đã lỡ có dữ liệu rồi sữa ko được nữa
                    cmd.Parameters.AddWithValue("@NguoiUpdate", userLoggedIn);
                    cmd.Parameters.AddWithValue("@Active", "T");

                    cmd.Parameters.AddWithValue("@NgayCreate", listManageUserInserted[i].NgayUpdate);
                    cmd.Parameters.AddWithValue("@NguoiCreate", idUsersLoggedIn);

                    cmd.Connection = sqlConnection;
                    sqlConnection.Open();
                    cmd.ExecuteNonQuery();
                    sqlConnection.Close();
                }
            }
        }// end for listManageUserInserted

        // Update các Row đã Update vào trong database
        for (int i = 0; i < listManageUserUpdated.Count; i++)
        {
            string query = "UPDATE users SET name=@name, userName=@userName, passWord=@passWord, passwordHash=@passwordHash, email=@email, phoneNumber=@phoneNumber, groups_id=@groups_id, idCongTrinhCapNuoc=@idCongTrinhCapNuoc, description=@description, NgayUpdate=@NgayUpdate, NguoiUpdate=@NguoiUpdate  WHERE id=@id";
            using (SqlConnection sqlConnection = classTT.CreateConnectionGis())
            {
                using (SqlCommand cmd = new SqlCommand(query))
                {
                    cmd.Parameters.AddWithValue("@id", listManageUserUpdated[i].id);
                    cmd.Parameters.AddWithValue("@name", listManageUserUpdated[i].name);
                    cmd.Parameters.AddWithValue("@userName", listManageUserUpdated[i].userName);
                    cmd.Parameters.AddWithValue("@passWord", listManageUserUpdated[i].password);
                    cmd.Parameters.AddWithValue("@passwordHash", RCVEncPwd(listManageUserUpdated[i].password).ToString());

                    cmd.Parameters.AddWithValue("@email", listManageUserUpdated[i].email);
                    cmd.Parameters.AddWithValue("@phoneNumber", listManageUserUpdated[i].phoneNumber);
                    cmd.Parameters.AddWithValue("@groups_id", listManageUserUpdated[i].groups_id);
                    //if (listManageUserUpdated[i].idCongTrinhCapNuoc != null)
                    //{
                    //    cmd.Parameters.AddWithValue("@idCongTrinhCapNuoc", listManageUserUpdated[i].idCongTrinhCapNuoc);
                    //}
                    //else
                    //{
                        cmd.Parameters.AddWithValue("@idCongTrinhCapNuoc", 40);
                    //}
                    cmd.Parameters.AddWithValue("@description", listManageUserUpdated[i].description);
                    cmd.Parameters.AddWithValue("@NgayUpdate", listManageUserUpdated[i].NgayUpdate);
                    // ở đây NguoiUpdate tạm thời cho giá trị mặc định là nhan, sau này sữa lại sau
                    cmd.Parameters.AddWithValue("@NguoiUpdate", userLoggedIn);
                    cmd.Connection = sqlConnection;
                    sqlConnection.Open();
                    cmd.ExecuteNonQuery();
                    sqlConnection.Close();
                }
            }
        }// end for listManageUserUpdated


    }// end Update function

    [WebMethod]
    public void Delete(string userLoggedIn, string idUsersLoggedIn, string listInsertedRow, string listUpdatedRow, string listRemovedRow)
    {
        // deserializer chuỗi(string) thành object lại
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var listManageUserDelete = serializer.Deserialize<List<manageuser>>(listRemovedRow);
        ClassTTNBT classTT = new ClassTTNBT();
        // Update các Row đã DeActive vào trong database
        for (int i = 0; i < listManageUserDelete.Count; i++)
        {
            string query = "UPDATE users SET name=@name, userName=@userName, passWord=@passWord, passwordHash=@passwordHash, email=@email, phoneNumber=@phoneNumber, groups_id=@groups_id, idCongTrinhCapNuoc=@idCongTrinhCapNuoc, description=@description, NgayUpdate=@NgayUpdate, NguoiUpdate=@NguoiUpdate, Active=@Active  WHERE id=@id";
            using (SqlConnection sqlConnection = classTT.CreateConnectionGis())
            {
                using (SqlCommand cmd = new SqlCommand(query))
                {
                    cmd.Parameters.AddWithValue("@id", listManageUserDelete[i].id);
                    cmd.Parameters.AddWithValue("@name", listManageUserDelete[i].name);
                    cmd.Parameters.AddWithValue("@userName", listManageUserDelete[i].userName);

                    cmd.Parameters.AddWithValue("@passWord", listManageUserDelete[i].password);

                    cmd.Parameters.AddWithValue("@passwordHash", RCVEncPwd(listManageUserDelete[i].password.ToString()));

                    cmd.Parameters.AddWithValue("@email", listManageUserDelete[i].email);
                    cmd.Parameters.AddWithValue("@phoneNumber", listManageUserDelete[i].phoneNumber);
                    cmd.Parameters.AddWithValue("@groups_id", listManageUserDelete[i].groups_id);
                    if (listManageUserDelete[i].idCongTrinhCapNuoc != null)
                    {
                        cmd.Parameters.AddWithValue("@idCongTrinhCapNuoc", listManageUserDelete[i].idCongTrinhCapNuoc);
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("@idCongTrinhCapNuoc", 40);
                    }
                    cmd.Parameters.AddWithValue("@description", listManageUserDelete[i].description);
                    cmd.Parameters.AddWithValue("@NgayUpdate", listManageUserDelete[i].NgayUpdate);
                    // ở đây NguoiUpdate tạm thời cho giá trị mặc định là nhan, sau này sữa lại sau
                    cmd.Parameters.AddWithValue("@NguoiUpdate", userLoggedIn);  
                    cmd.Parameters.AddWithValue("@Active", "F");
                    cmd.Connection = sqlConnection;
                    sqlConnection.Open();
                    cmd.ExecuteNonQuery();
                    sqlConnection.Close();
                }
            }

        }// end for listManageUserDeleted


    }// end Delete function




}
