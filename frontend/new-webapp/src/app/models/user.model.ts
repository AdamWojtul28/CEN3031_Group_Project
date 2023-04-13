export class User {
  constructor(
    public username: string,
    public password: string,
    public id: string,
    public email: string,
    public bio: string,
    public profile_image: string,

    private _token: string,
    private _tokenExpiration: Date
  ) {}

  get token() {
    if (!this._tokenExpiration || new Date() > this._tokenExpiration){
      return null;
    }
    return this._token;
  }

  get tokenExpiration() {
    return this._tokenExpiration;
  }
}

export interface LoginUserInfo {
  username: string,
  password: string,
  email: string,
}

export interface ResponseData {
  address_1 : string,
  address_2 : string,
  address_3 : string,
  biography: string,
  birthday: string,
  country: string,
  email: string,
  emergency_contact_address: string,
  emergency_contact_name : string,
  emergency_contact_phone_number : string,
  expiry : Date;
  gender : string;
  id : string;
  password : string;
  phone : string;
  session_token : string;
  username : string;
  profile_image : string;

}