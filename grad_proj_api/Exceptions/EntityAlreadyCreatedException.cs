using System;
using grad_proj_api.Exceptions.Messages;
using grad_proj_api.Helpers;

namespace grad_proj_api.Exceptions
{
    public class EntityAlreadyCreatedException : Exception
    {
        public EntityAlreadyCreatedException(Languages? language) : base(GetExceptionMessage(language)) { }
        public static string GetExceptionMessage(Languages? language)
        {
            var exceptionMessage = new ExceptionMessage(nameof(EntityAlreadyCreatedException));
            var message = language == null || language == Languages.Arabic ? exceptionMessage.ArabicMessageText : exceptionMessage.EnglishMessageText;
            return message;

        }
    }
}