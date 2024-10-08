export class User {
  constructor(
    public username: string,
    public password: string,
    public id: string,
    public email: string,
    public bio: string,
    public profile_image: string,
    public status: string,

    public phone : string,
    public address1: string,
    public address2: string,
    public address3: string,
    public country: string,
    public birthday: string,
    public gender: string,
    public emergency_contact_address: string,
    public emergency_contact_name : string,
    public emergency_contact_phone_number : string,


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

  renewToken(token: string, tokenExpiration: Date) {
    this._token = token;
    this._tokenExpiration = tokenExpiration;
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
  status: string;
  username : string;
  profile_image : string;
}

export interface Friendship {
  sender: string;
  reciever: string;
  status: string;
}