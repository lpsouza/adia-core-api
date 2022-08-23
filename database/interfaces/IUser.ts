import { ITokenInfo } from "./ITokenInfo";

export interface IUser {
    email: string;
    role: string;
    password?: string;
    name?: string;
    token?: ITokenInfo;
}
