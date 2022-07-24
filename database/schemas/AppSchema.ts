import { Schema } from "mongoose";
import { IApp } from "../interfaces/IApp";

export const AppSchema = new Schema<IApp>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    endpoint: { type: String, required: true },
    token: { type: String, required: false }
});
