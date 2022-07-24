import { ITelegramInfo } from "./ITelegramInfo";
import { ITokenInfo } from "./ITokenInfo";

export interface IUser {
    email: string;
    role: string;
    password?: string;
    name?: string;
    telegram?: ITelegramInfo;
    token?: ITokenInfo;
}
