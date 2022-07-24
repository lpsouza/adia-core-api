import * as bcrypt from 'bcryptjs';
import * as symmetricCrypto from "@hugoalh/symmetric-crypto";

export class Crypto {
    public static async generateHash(password: string): Promise<string> {
        return await bcrypt.hash(password, bcrypt.genSaltSync(8));
    }

    public static async compareHash(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    public static encryptData(data: string): string {
        return symmetricCrypto.encrypt(data, process.env.CRYPTO_KEY);
    }

    public static decryptData(data: string): string {
        return symmetricCrypto.decrypt(data, process.env.CRYPTO_KEY);
    }
}
