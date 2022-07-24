import { sign, verify } from 'jsonwebtoken'

export class TokenManager {
    public static generate(payload: any, expiresIn: number): string {
        return sign(payload, process.env.TOKEN_KEY, { expiresIn });
    }

    public static verify(token: string): any {
        return verify(token, process.env.TOKEN_KEY);
    }
}
