import * as bcrypt from "bcrypt";

class HashUtils {
  async hash(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async compare(data: string, encryptedData: string) {
    return await bcrypt.compare(data, encryptedData);
  }
}

export const hashUtils = new HashUtils();
