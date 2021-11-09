using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;
using FileDownload_API.OpenApi;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using FileDownload_API.Domain.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace FileDownload_API
{
    public class IdSettings {
        public string Url { get; set; }
        public string Audience { get; set; }
        public string ClientId { get; set; }
    }

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
            services.Configure<AppSettings>(Configuration);

            services.AddControllers(o => {
                var policy = new AuthorizationPolicyBuilder()
                                 .RequireAuthenticatedUser()
                                 .Build();

                //o.Filters.Add(new AuthorizeFilter(policy));
            });

            services.AddHttpClient();

            services
                .AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerGenOptions>()
                .AddSingleton<ITokenProvider, TokenProvider>();


            // Add Authentication services
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                Configuration.Bind($"{nameof(AppSettings.Security)}:{nameof(AppSettings.Security.Jwt)}", options);

                //options.Authority = ID_SETTINGS.Url;
                //options.RequireHttpsMetadata = false;
                //options.Audience = ID_SETTINGS.Audience;
            });



            services.AddCors(opts =>
            {
                opts.AddDefaultPolicy(builder =>
                       builder
                           .AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                   );
            });

            services.AddSwaggerGen();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var appSettings = Configuration.Get<AppSettings>();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();


                app
                    .UseSwagger()
                    .UseSwaggerUI(setup =>
                    {
                        setup.SwaggerEndpoint($"/swagger/v1/swagger.json", "Version 1.0");
                        setup.OAuthClientId(appSettings.Security.Jwt.ClientId);
                        setup.OAuthAppName("Downloader API");
                        setup.OAuthScopeSeparator(" ");
                        setup.OAuthUsePkce();
                    });
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors();


            // Authentication and Authorization should come after Routing and CORS
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers()
                    .RequireAuthorization();

                //endpoints.MapControllers();
            });
        }
    }
}
