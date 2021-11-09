import { UserInfo } from 'angular-oauth2-oidc';


// The Demo ID Server returs following for user profile endpoint
// {
//     "name": "Bob Smith",
//     "given_name": "Bob",
//     "family_name": "Smith",
//     "email": "BobSmith@email.com",
//     "email_verified": true,
//     "website": "http://bob.com",
//     "sub": "11"
// }
export interface OAuthUserProfile extends UserInfo {
  name: string,
  given_name: string,
  family_name: string,
  email: string,
  email_verified: string,
  website: string,
}

export interface UserProfile {
  fullName: string,
  firstName: string,
  lastName: string,
  email: string,
  emailVerified: boolean,
  website: string
}
