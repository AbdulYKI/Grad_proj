namespace grad_proj_api.Exceptions {
    [System.Serializable]
    public class UsernameUsedException : System.Exception {

        public UsernameUsedException (string message) : base (message) { }

    }
}