using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileDownload_API.Domain.Interfaces
{
    public interface IDownloadTokenService
    {
        public string CreateToken();

        public bool ValidateToken();
    }
}
