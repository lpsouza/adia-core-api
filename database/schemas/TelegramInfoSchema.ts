import { Schema } from "mongoose";
import { ITelegramInfo } from "../interfaces/ITelegramInfo";

export const TelegramInfoSchema = new Schema<ITelegramInfo>({
    id: { type: String, required: true },
    lang: { type: String, required: true }
});
