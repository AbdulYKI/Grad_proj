using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Data;
using grad_proj_api.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
namespace grad_proj_api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        { //Connecting to the database
            services.AddEntityFrameworkSqlite()
                .AddDbContext<DataContext>(db => db.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            //adds cors specified in Configure(IApplicationBuilder app,IHostingEnvironment env)
            services.AddCors();
            //adds automapper 
            services.AddAutoMapper(typeof(Startup));
            //adds the authentication service
            services.AddScoped<IAuthRepository, AuthRepository>();
            //adds the MainRepository service
            services.AddScoped<IMainRepository, MainRepository>();
            //adds token authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    IConfigurationSection mainAuth =
                        Configuration.GetSection("Authentication:MainAuth");

                    options.TokenValidationParameters = new TokenValidationParameters
                    {

                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(mainAuth["Secret"])),
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                    // options.Events = new JwtBearerEvents
                    // {
                    //     OnMessageReceived = context =>
                    //     {
                    //         var path = context.HttpContext.Request.Path;
                    //         var accessToken = context.Request.Query["access_token"];
                    //         if (!string.IsNullOrEmpty(accessToken) &&
                    //        (path.StartsWithSegments("/api/chat")))
                    //         {
                    //             context.Token = accessToken;
                    //         }
                    //         return Task.CompletedTask;
                    //     }
                    // };
                });
            services.AddControllers();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200").AllowCredentials());
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}