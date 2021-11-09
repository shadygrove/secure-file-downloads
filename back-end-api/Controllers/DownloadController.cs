using FileDownload_API.Domain;
using FileDownload_API.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace FileDownload_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DownloadController : ControllerBase
    {
        ITokenProvider _tokenProvider;

        public DownloadController (ITokenProvider tokenProvider)
        {
            this._tokenProvider = tokenProvider;
        }


        [HttpGet("{fileName}")]
        [ResponseCache(NoStore = true)]
        public IActionResult Download(string fileName)
        {
            var filePath = Path.Combine(Environment.CurrentDirectory, "FilesForDownload", $"{fileName}.zip");
            return PhysicalFile(filePath, "application/zip");
        }

        [HttpGet("{fileName}/file")]
        [ResponseCache(NoStore = true)]
        public IActionResult DownloadFile(string fileName)
        {
            var filePath = Path.Combine(Environment.CurrentDirectory, "FilesForDownload", $"{fileName}.zip");

            byte[] bytes = System.IO.File.ReadAllBytes(filePath);

            return File(bytes, "application/zip");
        }

        [HttpGet("{fileName}/stream")]
        [ResponseCache(NoStore = true)]
        public IActionResult DownloadStream(string fileName)
        {
            var filePath = Path.Combine(Environment.CurrentDirectory, "FilesForDownload", $"{fileName}.zip");

            FileStream fileStream = System.IO.File.OpenRead(filePath);

            return new FileStreamResult(fileStream, "application/octet-stream");
        }

        //[AllowAnonymous]
        //[HttpGet("insecure/{fileName}")]
        //[ResponseCache(NoStore = true)]
        //public IActionResult InsecureDownload(string fileName)
        //{
        //    var filePath = Path.Combine(Environment.CurrentDirectory, "FilesForDownload", $"{fileName}.zip");
        //    return PhysicalFile(filePath, "application/zip");
        //}

        //[HttpGet("encrypt")]
        //[ResponseCache(NoStore = true)]
        //public ActionResult CreateKey([FromQuery] string secret)
        //{
        //    string result = _tokenProvider.EncryptToString(secret);

        //    return new ObjectResult(new { secret = result });
        //}

        [HttpGet("{fileName}/token")]
        [ResponseCache(NoStore = true)]
        public DownloadTokenResult Token(string fileName)
        {
            //var filePath = Path.Combine(Environment.CurrentDirectory, "FilesForDownload", $"{fileName}.zip");
            //return PhysicalFile(filePath, "application/zip");
            DownloadTokenResult result = _tokenProvider.GenerateDownloadToken(fileName, false);

            return result;
        }

        [AllowAnonymous]
        [HttpGet("{fileName}/token/download")]
        [ResponseCache(NoStore = true)]
        public IActionResult TokenDownload(string fileName, [FromQuery] string token)
        {            
            JwtSecurityToken validatedToken;
            try
            {
                validatedToken = _tokenProvider.ValidateToken(token);
            }
            catch (Exception ex)
            {
                return StatusCode(401);
            }

            if (validatedToken.Claims.FirstOrDefault(c => c.Type == "file-name").Value != fileName)
            {
                return BadRequest(new { error = "Requests filename does not match token filename" });
            }

            var filePath = Path.Combine(Environment.CurrentDirectory, "FilesForDownload", $"{fileName}.zip");
            return PhysicalFile(filePath, "application/zip");
        }

    }
}
