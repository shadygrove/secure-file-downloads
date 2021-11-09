using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileDownload_API.Domain
{
    public class DownloadTokenResult
    {
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
    }
}
