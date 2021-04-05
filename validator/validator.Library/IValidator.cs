namespace validator.Library
{
    public interface IValidator
    {
        StatusCode Validate(string folderPath);
    }
}