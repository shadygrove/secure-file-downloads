using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace FileDownload_API.Domain.Services
{
    public class TokenProvider : ITokenProvider
    {
        IOptions<AppSettings> _settings;

        private string ISSUER;
        private string AUDIENCE;

        public TokenProvider(IOptions<AppSettings> settings) {
            this._settings = settings;

            ISSUER = this._settings.Value.Security.Jwt.Issuer;
            AUDIENCE = this._settings.Value.Security.Jwt.Audience;
        }

        private SymmetricSecurityKey GetSigningKey()
        {
            string key = _settings.Value.Security.JwtKey;
            byte[] keyBytes = System.Text.Encoding.Default.GetBytes(key);
            return new SymmetricSecurityKey(keyBytes);
        }

        private SymmetricSecurityKey GetTokenKey()
        {
            string key = _settings.Value.Security.JwtKey;
            byte[] keyBytes = System.Text.Encoding.Default.GetBytes(key);
            return new SymmetricSecurityKey(keyBytes);
        }

        public DownloadTokenResult GenerateDownloadToken(string fileName, bool encryptToken)
        {
            var mySecurityKey = GetSigningKey();
            var encryptionKey = GetTokenKey();

            // See this issue with ClockSkew default of 5 minutes
            // https://stackoverflow.com/questions/39728519/jwtsecuritytoken-doesnt-expire-when-it-should
            var issuedAt = DateTime.UtcNow;
            var expiry = issuedAt.AddSeconds(60);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                            {
                                // Minimize personally identifiable info
                                // Do keep the User UID for auditing purposes
                                new Claim("file-name", fileName),
                            }),
                Expires = expiry,
                Issuer = ISSUER,
                Audience = AUDIENCE,
                IssuedAt = issuedAt,
                SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature),

                // Optional: encrypt security key; harder to debug
                EncryptingCredentials = new EncryptingCredentials(encryptionKey, JwtConstants.DirectKeyUseAlg, SecurityAlgorithms.Aes256CbcHmacSha512)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return new DownloadTokenResult() { Token = tokenString, Expiration = token.ValidTo };
        }

        //public JwtDownloadToken FromBase64(string base64Token)
        //{
        //    var tokenHandler = new JwtSecurityTokenHandler();

        //    var jwt = tokenHandler.ReadJwtToken(base64Token);
            
        //    return new JwtDownloadToken {
        //        FileName = jwt.Claims.FirstOrDefault(c => c.Type == "file-name").Value
        //    };
        //}

        public JwtSecurityToken ValidateToken(string token)
        {
            var mySecurityKey = GetSigningKey();
            var decryptionKey = GetTokenKey();

            var myIssuer = ISSUER;
            var myAudience = AUDIENCE;

            SecurityToken validatedToken;

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = myIssuer,
                    ValidAudience = myAudience,
                    IssuerSigningKey = mySecurityKey,
                    TokenDecryptionKey = decryptionKey,
                    // See this issue with ClockSkew default of 5 minutes
                    // https://stackoverflow.com/questions/39728519/jwtsecuritytoken-doesnt-expire-when-it-should
                    ClockSkew = TimeSpan.FromSeconds(10)
                }, out validatedToken);

                //int dateCompare = validatedToken.ValidTo.CompareTo(DateTime.Now);
                //if (dateCompare <= 0)
                //{
                //    return false;
                //}

                return (JwtSecurityToken)validatedToken;
            }
            catch (SecurityTokenDecryptionFailedException decryptionEx)
            {
                throw decryptionEx;
            }
            //catch (SecurityTokenEncryptionKeyNotFoundException keyNotFoudnEx) { }
            catch (SecurityTokenException tokenEx) {
                throw tokenEx;
            }
            //catch (SecurityTokenExpiredException tokenExpiredEx) { }
            //catch (SecurityTokenInvalidAudienceException audEx) { }
            //catch (SecurityTokenInvalidLifetimeException lifetimeEx) { }
            //catch (SecurityTokenInvalidSignatureException sigEx) { }
            //catch (SecurityTokenNoExpirationException expiryEx) { }
            //catch (SecurityTokenNoExpirationException noExpiryEx) { }
            //catch (SecurityTokenNotYetValidException tokenNotValidEx) { }
            //catch (SecurityTokenReplayAddFailedException replayEx) { }
            //catch (SecurityTokenReplayDetectedException replayDeEx) { }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
