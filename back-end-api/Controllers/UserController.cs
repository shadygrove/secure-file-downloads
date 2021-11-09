using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileDownload_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public IActionResult Claims()
        {
            var claims = this.User.Claims.Select(c =>
            {
                return new
                {
                    type = c.Type,
                    value = c.Value
                };
            });

            return Ok(claims);
        }
    }
}
