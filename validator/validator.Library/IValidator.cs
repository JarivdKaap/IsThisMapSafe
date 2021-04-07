using System;

namespace validator.Library
{
    public interface IValidator
    {
        Tuple<StatusCode, AlertMessage[]> Validate(string folderPath);
    }
}