namespace grad_proj_api.Exceptions
{
    [System.Serializable]
    public class UpdatingFailedException : System.Exception
    {

        public UpdatingFailedException(string message) : base(message) { }

    }

}