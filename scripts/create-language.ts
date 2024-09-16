import { PrismaClient } from "@prisma/client";

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

const db = new PrismaClient();

async function main() {
  await db.language.create({
    data: {
      code,
      name,
    },
  });
}

const code = getFlag("-c", "Language code is required (-c)");
const name = getFlag("-n", "Language name is required (-n)");

await main();
