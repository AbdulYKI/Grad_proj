using System;
using System.Net;
using System.Threading.Tasks;
using grad_proj_api.Interfaces;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace grad_proj_api.Exceptions
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILoggerManager _logger;

        public ExceptionMiddleware(RequestDelegate next, ILoggerManager logger)
        {
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                await HandleExceptionAsync(httpContext, ex);

            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {

            var internalServerErrorMessage = "We Apologise, But We Are Facing Difficulties Processing Your Request \n نعتذر و لكن واجهنا مشكلة بتنفيذ الطلب";
            var statusCode = GetHttpStatusCodeForException(exception);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            await context.Response.WriteAsync(statusCode == (int)HttpStatusCode.InternalServerError ? internalServerErrorMessage : exception.Message);



        }

        private static int GetHttpStatusCodeForException(Exception exception)
        {



            if (exception is EmailUsedException ||
                exception is UsernameUsedException)
                return (int)HttpStatusCode.UnprocessableEntity;
            else if (exception is FailedToUpdateEntityException
            || exception is FailedToDeleteEntityException
            || exception is FailedToCreateEntityException
            || exception is UsernameUsedException
            || exception is EmailUsedException
            )
                return (int)HttpStatusCode.Conflict;
            else if (exception is NotFoundException)
                return (int)HttpStatusCode.NotFound;
            else if (exception is UnauthorisedException)
                return (int)HttpStatusCode.Unauthorized;


            return (int)HttpStatusCode.InternalServerError;

        }
    }
}