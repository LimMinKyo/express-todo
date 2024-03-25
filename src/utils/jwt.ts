import * as jwt from "jsonwebtoken";

class JwtUtils {
  private readonly privateKey = process.env.JWT_PRIVATE_KEY || "";

  sign(userId: number) {
    return jwt.sign({ id: userId }, this.privateKey);
  }

  verify(token: string) {
    return jwt.verify(token, this.privateKey);
  }
}

export const jwtUtils = new JwtUtils();
