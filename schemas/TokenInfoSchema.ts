import { Schema, model } from "mongoose";
import { ITokenInfo } from "../interfaces/ITokenInfo";

export const TokenInfoSchema = new Schema<ITokenInfo>({
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresIn: { type: Number, required: true }
});

