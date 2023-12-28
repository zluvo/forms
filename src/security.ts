import crypto from "crypto";

export default class Security {
  private static hash(payload: string): string {
    if (!process.env.ZLUVO_CSRF) {
      throw new Error("process.env.ZLUVO_CSRF is not defined");
    }

    return crypto
      .createHmac("sha256", `secret:${process.env.ZLUVO_CSRF}`)
      .update(payload)
      .digest("hex");
  }

  static generate() {
    const payload = Buffer.from(crypto.randomUUID()).toString("base64");
    return `${payload}.${this.hash(payload)}`;
  }

  static valid(value: string): boolean {
    const keyParts = value.split(".");
    if (keyParts[0] && keyParts[1]) {
      return this.hash(keyParts[0]) === keyParts[1];
    }
    return false;
  }
}
