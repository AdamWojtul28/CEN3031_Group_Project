
export interface UpdateProfileInfoModel{
  username? : string;
  email? : string;
  password? : string;
}

export interface UpdatePfpModel {
  image : string | ArrayBuffer;
}