using System;
using grad_proj_api.Exceptions.Messages;
using grad_proj_api.Helpers;

namespace grad_proj_api.Exceptions
{
    [System.Serializable]
    public class UsernameUsedException : System.Exception
    {

        public UsernameUsedException(Languages? language) : base(GetExceptionMessage(language)) { }
        public static string GetExceptionMessage(Languages? language)
        {

            var exceptionMessage = new ExceptionMessage(nameof(UsernameUsedException));
            var message = language == null || language == Languages.Arabic ? exceptionMessage.ArabicMessageText : exceptionMessage.EnglishMessageText;
            return message;
        }

    }
}