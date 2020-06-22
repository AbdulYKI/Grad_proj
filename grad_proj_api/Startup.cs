using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using grad_proj_api.Data;
using grad_proj_api.Exceptions;
using grad_proj_api.Helpers;
using grad_proj_api.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using NLog;

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

            // services.AddMvc().AddJsonOptions(o => o.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc);
            //adds cors specified in Configure(IApplicationBuilder app,IHostingEnvironment env)
            services.AddCors();
            //adds automapper 
            services.AddAutoMapper(typeof(Startup));
            //adds the authentication service
            services.AddScoped<IAuthRepository, AuthRepository>();
            //adds the MainRepository service
            services.AddScoped<IMainRepository, MainRepository>();
            //adds the LoggerManager service
            services.AddSingleton<ILoggerManager, LoggerManager>();
            //adds Cloudinaryy Strongly Typed Configuration
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
            //adds token authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {

                    options.TokenValidationParameters = new TokenValidationParameters
                    {

                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("Appsettings:Token").Value)),
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var path = context.HttpContext.Request.Path;
                            var accessToken = context.Request.Query["access_token"];
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/api/chat")))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            //adds Seed so I can use it in seed
            services.AddTransient<Seed>();
            services.AddTransient<LogUserActivity>();
            services.AddSignalR();
            services.AddControllers()
                .AddNewtonsoftJson(opt =>
                {
                    opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    opt.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, Seed seeder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseMiddleware<ExceptionMiddleware>();
            LogManager.LoadConfiguration(String.Concat(Directory.GetCurrentDirectory(), "/nlog.config.xml"));
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200").AllowCredentials());
            app.UseAuthentication();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>("/api/chat");
                endpoints.MapControllers();
            });

        }
    }
}