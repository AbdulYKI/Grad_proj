namespace grad_proj_api.Exceptions
{
    [System.Serializable]
    public class EmailUsedException : System.Exception
    {

        public EmailUsedException(string message) : base(message) { }

    }

}