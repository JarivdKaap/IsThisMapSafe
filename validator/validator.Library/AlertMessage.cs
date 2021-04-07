using System;
using validator.Library.Utility;

namespace validator.Library
{
    [Serializable]
    public class AlertMessage
    {
        public MessageStatus messsageStatus;
        public string message;
    }
}