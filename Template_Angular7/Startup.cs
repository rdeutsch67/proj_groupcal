using System;
//using cloudscribe.Web.Common;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Template_Angular7.Data;
using Newtonsoft.Json;
/*using NodaTime;
using NodaTime.TimeZones;*/

//using System.Web.OData.Extensions;

namespace Template_Angular7
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
        {
            /*services.TryAddSingleton<IDateTimeZoneProvider>(new DateTimeZoneCache(TzdbDateTimeZoneSource.Default));
            services.TryAddScoped<ITimeZoneHelper, TimeZoneHelper>();*/
            
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddEntityFrameworkNpgsql().AddDbContext<ApplicationDbContext>(opt =>
                opt.UseNpgsql(Configuration.GetConnectionString("MyWebApiConnection")));

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
            
            services.AddMvc().AddJsonOptions(config =>
            {
                // This prevents the json serializer from parsing dates
                config.SerializerSettings.DateParseHandling = DateParseHandling.None;
                // This changes how the timezone is converted - RoundtripKind keeps the timezone that was provided and doesn't convert it
                config.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.RoundtripKind;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                
                //routes.SetTimeZoneInfo(TimeZoneInfo.Utc);
                
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });
            
            /*app.UseMvc(b=>{
                b.SetTimeZoneInfo(TimeZoneInfo.Utc);
                b.MapODataServiceRoute(....);
            })*/

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
            
            // Create a service scope to get an ApplicationDbContext instance using DI
            using (var serviceScope =
                app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();
                // Create the Db if it doesn't exist and applies any pending migration.
                dbContext.Database.Migrate();
                // Seed the Db.
                DBSeeder.Seed(dbContext);
            }
        }
    }
}