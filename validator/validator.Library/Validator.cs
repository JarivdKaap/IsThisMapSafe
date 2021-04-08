using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using FastScanner;
using validator.Library.Utility;

namespace validator.Library
{
    public class Validator : IValidator
    {
        /// <summary>
        /// List to store amber warnings
        /// </summary>
        public static List<string> AmberWarnings = new List<string>();

        /// <summary>
        /// List to store red alerts
        /// </summary>
        public static List<string> RedWarnings = new List<string>();
        
        /// <summary>
        /// Analyzes a folder with Black Ops III zone files 
        /// </summary>
        /// <param name="folderPath"></param>
        /// <returns></returns>
        public Tuple<StatusCode, AlertMessage[]> Validate(string folderPath)
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
                
                // Delete the decoded file
                File.Delete(fastFile + ".output");
            }

            StatusCode workshopFolderFilesStatus = WorkshopFolderFiles.Analyse(folderPath);
            if (workshopFolderFilesStatus > statusLevel)
                statusLevel = workshopFolderFilesStatus;

            AlertMessage[] messages = AmberWarnings
                .Distinct().Select(w => new AlertMessage() { messsageStatus = MessageStatus.Warning, message = w})
                .Concat(RedWarnings.Distinct().Select(w => new AlertMessage() { messsageStatus = MessageStatus.Alert, message = w}).ToList()).ToArray();
            
            return new Tuple<StatusCode, AlertMessage[]>(statusLevel, messages);
        }
    }
}