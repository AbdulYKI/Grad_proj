using System;
using System.Security.Claims;
using System.Threading.Tasks;
using grad_proj_api.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace grad_proj_api.Helpers

{

    public class LogUserActivity : IAsyncActionFilter

    {

        public async Task OnActionExecutionAsync (ActionExecutingContext context, ActionExecutionDelegate next)

        {
            //the resultContext gives access to the token which in turn
            //gives access to the userId 
            var resultContext = await next ();
            var nameIdentifier = resultContext.HttpContext.User
                .FindFirst (ClaimTypes.NameIdentifier);
            if (nameIdentifier != null) {
                var userId = int.Parse (nameIdentifier.Value);

                var repo = resultContext.HttpContext.RequestServices.GetService<IMainRepository> ();

                var user = await repo.GetUser (userId);

                user.LastActiveUtc = DateTime.UtcNow;

                await repo.SaveAll ();
            }

        }

    }

}