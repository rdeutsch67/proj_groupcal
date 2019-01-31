using Newtonsoft.Json;
using System;

namespace Template_Angular7.ViewModels
{
    [JsonObject(MemberSerialization.OptOut)]
    
    public class LoginBenutzerViewModel
    {
        #region Constructor
        public LoginBenutzerViewModel()
        {
        }
        #endregion
        
        #region Properties
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        #endregion
    }
}

