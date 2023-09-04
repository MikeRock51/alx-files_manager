import sha1 from 'sha1';

class Utils {
  static hashPassword(password) {
    return sha1(password);
  }
}

export default Utils;
