// import { shuffle } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

const language = getFlag("-l", "Language is required (-l)");
// const challenge = getFlag("-m", "Challenge text is required (-m)");
// const bait = getFlag("-b", "Bait words are required (-b)");
// const translate = getFlag("-t", "Translation is required (-t)");

async function main() {
  // const newChallenge = shuffle([...challenge.split(" "), ...bait.split(" ")]);

  const languageCode = await prisma.language.findUnique({
    where: {
      code: language,
    },
  });

  if (!languageCode) {
    await prisma.language.create({
      data: {
        code: language,
        name: language,
      },
    });
  }

  throw new Error("Fix script");

  // const lesson = await prisma.lesson.create({
  //   data: {
  //     name: "Basics",
  //     languageCode: language,
  //     challenges: {
  //       create: {
  //         sentence: {
  //           create: {
  //             Word: {
  //               create: newChallenge.map((word) => ({
  //                 text: word,
  //               })),
  //             },
  //             translate,
  //             text: newChallenge,
  //             answer: challenge,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  console.log("Done!");

  prisma.$disconnect();
}

await main();
