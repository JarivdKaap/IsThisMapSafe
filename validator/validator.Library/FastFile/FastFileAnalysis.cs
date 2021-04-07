using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.IO.Compression;
using PhilLibX.IO;
using validator.Library;

/*
 * Based on Cerberus.Logic (Credit: Scobalula)
 * Source: https://github.com/Scobalula/Cerberus-Repo/blob/master/Cerberus.Logic/FastFile.cs
*/

namespace FastScanner
{
    public static class FastFileAnalysis
    {
        /// <summary>
        /// Invalid Characters from C# Reference Source
        /// </summary>
        internal static readonly char[] InvalidPathChars =
        {
            '\"', '<', '>', '|', '\0',
            (char)1, (char)2, (char)3, (char)4, (char)5, (char)6, (char)7, (char)8, (char)9, (char)10,
            (char)11, (char)12, (char)13, (char)14, (char)15, (char)16, (char)17, (char)18, (char)19, (char)20,
            (char)21, (char)22, (char)23, (char)24, (char)25, (char)26, (char)27, (char)28, (char)29, (char)30,
            (char)31
        };

        /// <summary>
        /// Black Ops III Fast File Search Needle
        /// </summary>
        private static readonly byte[] NeedleBo3 = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };

        /// <summary>
        /// Registered processors we can use for file-specific analysis
        /// </summary>
        internal static Dictionary<string, Func<string, byte[], StatusCode>> FileProcessors = new Dictionary<string, Func<string, byte[], StatusCode>>
        {
            { ".lua", (string fileName, byte[] fileData) =>
            {
                //LuaFile.Analyse(fileName, fileData);
                return StatusCode.Safe;
            } },
            { ".gsc", (string fileName, byte[] fileData) =>
            {
                return ScriptFile.Analyse(fileData, fileName);
            } },
            { ".csc", (string fileName, byte[] fileData) =>
            {
                return ScriptFile.Analyse(fileData, fileName);
            } },
        };

        /// <summary>
        /// Scans a decompressed Black Ops III Fast File and runs any file-specific processors where applicable.
        /// </summary>
        internal static StatusCode ScanDecompressedFastFile(BinaryReader reader)
        {
            // Need to skip the strings and assets
            // to avoid redundant checks on these by
            // the scanner
            var stringCount = reader.ReadInt32();
            reader.BaseStream.Position = 32;
            var assetCount = reader.ReadInt32();

            reader.BaseStream.Position = 56 + (stringCount - 1) * 8;

            for (int i = 0; i < stringCount; i++)
            {
                reader.ReadNullTerminatedString();
            }

            reader.BaseStream.Position += 16 * assetCount;


            var results = new List<string>();
            var offsets = reader.FindBytes(NeedleBo3);

            StatusCode level = StatusCode.Safe;
            foreach (var offset in offsets)
            {
                try
                {
                    reader.BaseStream.Position = offset;

                    var namePtr = reader.ReadUInt64();
                    var size = reader.ReadInt64();
                    var dataPtr = reader.ReadUInt64();

                    // Check the pointers
                    if (namePtr == 0xFFFFFFFFFFFFFFFF && dataPtr == 0xFFFFFFFFFFFFFFFF && size <= uint.MaxValue)
                    {
                        // Linker only allows names up to 127
                        var name = reader.ReadNullTerminatedString(128);

                        if (name.IndexOfAny(InvalidPathChars) < 0)
                        {
                            var extension = Path.GetExtension(name);

                            foreach(KeyValuePair<string, Func<string, byte[], StatusCode>> processor in FileProcessors)
                            {
                                if( extension == processor.Key)
                                {
                                    StatusCode newLevel = processor.Value.Invoke(name, reader.ReadBytes((int)size));
                                    if (newLevel > level)
                                        level = newLevel;
                                    break;
                                }
                            }
                        }
                    }
                }
                catch(Exception e)
                {
                    Console.WriteLine(": ERROR: " + e);
                    continue;
                }
            }

            return level;
        }
    }
}
