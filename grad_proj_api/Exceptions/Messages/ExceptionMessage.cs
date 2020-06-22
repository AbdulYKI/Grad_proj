using System;
using Newtonsoft.Json;

namespace grad_proj_api.Exceptions.Messages
{
    public class ExceptionMessage
    {
        public string ArabicMessageText { get; set; }
        public string EnglishMessageText { get; set; }
        public ExceptionMessage() { }
        public ExceptionMessage(string exceptionName)
        {
            var exceptionMessageJson = System.IO.File.ReadAllText("Exceptions/Messages/" + exceptionName + "Message.json");
            var exceptionMessage = JsonConvert.DeserializeObject<ExceptionMessage>(exceptionMessageJson);
            this.ArabicMessageText = exceptionMessage.ArabicMessageText;
            this.EnglishMessageText = exceptionMessage.EnglishMessageText;
        }
    }
}