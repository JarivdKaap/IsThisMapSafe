using System;
using System.IO;
using FastScanner;

namespace validator.Library
{
    public class Validator : IValidator
    {
        /// <summary>
        /// Analyzes a folder with Black Ops III zone files 
        /// </summary>
        /// <param name="folderPath"></param>
        /// <returns></returns>
        public StatusCode Validate(string folderPath)
        {
            if (!Directory.Exists(folderPath))
            {
                throw new Exception("Directory does not exist");
            }
            
            // Start with the status safe
            StatusCode statusLevel = StatusCode.Safe;

            foreach (var fastFile in Directory.GetFiles(folderPath, "*.ff"))
            {
                FastFile.Decompress(fastFile, fastFile + ".output");
                
                // Run logic to analyse
                using (var reader = new BinaryReader(File.OpenRead(fastFile + ".output")))
                {
                    // Scan the fast file
                    StatusCode code = FastFileAnalysis.ScanDecompressedFastFile(reader);
                    // If the new level is higher than the previous one, change it to the new one
                    if (code > statusLevel)
                        statusLevel = code;
                }
            }

            return statusLevel;
        }
    }
}