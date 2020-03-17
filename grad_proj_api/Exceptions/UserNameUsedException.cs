namespace grad_proj_api.Exceptions
{
    [System.Serializable]
    public class UserNameUsedException : System.Exception
    {

        public UserNameUsedException(string message) : base(message) { }

    }
}