import { ITelegramInfo } from "./ITelegramInfo";
import { ITokenInfo } from "./ITokenInfo";

export interface IUser {
    email: string;
    password?: string;
    role: string;
    name?: string;
    telegram?: ITelegramInfo;
    token?: ITokenInfo;
}
