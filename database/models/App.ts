import { model } from "mongoose";
import { IApp } from "../interfaces/IApp";
import { AppSchema } from "../schemas/AppSchema";

export const App = model<IApp>("apps", AppSchema);
