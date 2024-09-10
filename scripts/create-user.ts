import { createUser } from "@/actions/users/user.action";

function getFlag(flag: string, error: string): string {
  let value = "";
  process.argv.forEach(function (val, index) {
    if (val == flag) {
      if (process.argv[index + 1] == undefined) {
        throw error;
      }
      value = process.argv[index + 1];
    }
  });

  if (value == "") {
    throw error;
  }

  return value;
}

const email = getFlag("-e", "Email is required (-e)");
const password = getFlag("-p", "Password is required (-p)");
const name = getFlag("-n", "Name is required (-n)");

await createUser({
  email,
  password,
  name,
});
