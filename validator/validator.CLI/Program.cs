using System;
using System.IO;
using Autofac;
using validator.Library;

namespace validator.CLI
{
    class Program
    {
        static int Main(string[] args)
        {
            if (args.Length != 1 || !Directory.Exists(args[0]))
            {
                return 0;
            }
            
            // Setup dependency injection
            var builder = new ContainerBuilder();
            builder.RegisterType<Validator>().As<IValidator>().SingleInstance();
            var container = builder.Build();
            
            StatusCode statusCode = container.Resolve<IValidator>().Validate(args[0]);

            return (int) statusCode;
        }
    }
}