using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace FileDownload_API.Domain.Services
{
    public interface ITokenProvider
    {
        DownloadTokenResult GenerateDownloadToken(string fileName, bool encryptToken);

        JwtSecurityToken ValidateToken(string token);
    }
}
