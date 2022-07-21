import { ITokenInfo } from "./ITokenInfo";

export interface IUser {
    email: string;
    role: string;
    name?: string;
    telegramId?: string;
    token?: ITokenInfo;
}
