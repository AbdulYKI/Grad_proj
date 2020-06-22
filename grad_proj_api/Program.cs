using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using grad_proj_api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


namespace grad_proj_api
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using (var servicesScope = host.Services.CreateScope())
            {
                var dbContext = servicesScope.ServiceProvider.GetRequiredService<DataContext>();
                await dbContext.Database.MigrateAsync();
                if (await dbContext.Countries.CountAsync() == 0)
                {
                    var seeder = servicesScope.ServiceProvider.GetRequiredService<Seed>();
                    await seeder.SeedCountries();
                }

                if (await dbContext.ProgrammingLanguages.CountAsync() == 0)
                {
                    var seeder = servicesScope.ServiceProvider.GetRequiredService<Seed>();
                    await seeder.SeedProgrammingLanguages();
                }

                var logger = NLog.Web.NLogBuilder.ConfigureNLog("nlog.config.xml").GetCurrentClassLogger();
                try
                {
                    logger.Debug("init main");
                    CreateHostBuilder(args).Build().Run();
                }
                catch (Exception exception)
                {
                    //NLog: catch setup errors
                    logger.Error(exception, "Stopped program because of exception");
                    throw;
                }
                finally
                {
                    // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
                    NLog.LogManager.Shutdown();
                }
            }
            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
    }
}