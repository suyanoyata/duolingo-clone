import bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hashedPass) => {
      if (err) {
        reject(err);
      } else {
        resolve(hashedPass);
      }
    });
  });
};
