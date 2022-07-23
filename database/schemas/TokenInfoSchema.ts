import { Schema } from "mongoose";
import { ITokenInfo } from "../interfaces/ITokenInfo";

export const TokenInfoSchema = new Schema<ITokenInfo>({
    access: { type: String, required: true },
    refresh: { type: String, required: true },
    expireDate: { type: Date, required: true }
});
