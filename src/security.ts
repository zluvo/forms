import crypto from "crypto";

export default class security {
  private static hash(payload: string): string {
    return crypto
      .createHmac("sha256", `secret:${process.env.ZLUVO_CSRF || ""}`)
      .update(payload)
      .digest("hex");
  }

  static generate() {
    const payload = crypto.randomBytes(10).toString("hex");
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
