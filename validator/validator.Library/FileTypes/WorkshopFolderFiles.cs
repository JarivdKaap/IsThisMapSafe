using System.IO;
using validator.Library;

namespace FastScanner
{
    public class WorkshopFolderFiles
    {
        /// <summary>
        /// Expected file types within a map/mod Workshop folder. All those that aren't these, but aren't Suspect either, will be amber flagged.
        /// </summary>
        static readonly string[] ExpectedFiles =
        {
            ".ff",
            ".xpak",
            ".json",
            ".mkv",
            ".sabl",
            ".sabs",
            ".png",
            ".jpg",
        };

        /// <summary>
        /// Suspect file types within a map/mod Workshop folder. All files of these types will be red flagged.
        /// </summary>
        static readonly string[] DangerousFiles =
        {
            ".exe",
            ".dll",
            ".bat",
            ".iso",
            ".dif",
            ".com",
        };
        
        internal static StatusCode Analyse(string folderPath)
        {
            StatusCode level = StatusCode.Safe;

            foreach (var file in Directory.GetFiles(folderPath, "*.*", SearchOption.AllDirectories))
            {
                string fileExtension = Path.GetExtension(file);
                bool found = false;

                // Check the extension of this file against our known "normal" files.
                foreach(var extension in ExpectedFiles)
                {
                    if(fileExtension == extension)
                    {
                        found = true;
                        // safe (probably)
                        break;
                    }
                }
                
                // If neither of the above found anything, we'll log an unrecognized file.
                if(!found)
                {
                    //log an amber alert
                    Validator.AmberWarnings.Add("File with an extension you wouldn't normally expect: " + Path.GetFileName(file));
                    if (level < StatusCode.Warning)
                        level = StatusCode.Warning;
                }

                // Check the extension of this file against suspicious file extensions.
                foreach(var extension in DangerousFiles)
                {
                    if(fileExtension == extension)
                    {
                        found = true;
                        Validator.RedWarnings.Add("File with known potentially harmful extension: "+Path.GetFileName(file));
                        if (level < StatusCode.Dangerous)
                            level = StatusCode.Dangerous;
                        break;
                    }
                }
            }

            return level;
        }
    }
}