using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using Newtonsoft.Json;
using validator.Library;

namespace validator.CLI
{
    class Program
    {
        static async Task<int> Main(string[] args)
        {
            if (args.Length != 3 || !Directory.Exists(args[0]))
            {
                return 0;
            }
            
            // Setup dependency injection
            var builder = new ContainerBuilder();
            builder.RegisterType<Validator>().As<IValidator>().SingleInstance();
            var container = builder.Build();
            
            Tuple<StatusCode, AlertMessage[]> validatorResult = container.Resolve<IValidator>().Validate(args[0]);

            if (validatorResult.Item2.Length > 0)
            {
                HttpClient client = new HttpClient() { BaseAddress = new Uri($"http://localhost:{args[2]}")};
                var content = new StringContent(JsonConvert.SerializeObject(new { messages = validatorResult.Item2}), Encoding.UTF8, "application/json");
                await client.PostAsync($"/api/mapstatus/messages/{args[1]}", content);
            }
            
            return (int) validatorResult.Item1;
        }
    }
}