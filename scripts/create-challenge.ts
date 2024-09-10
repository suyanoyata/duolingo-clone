import { shuffle } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let challenge = "";
let bait = "";
let translate = "";

function getChallengeText() {
  process.argv.forEach(function (val, index) {
    if (val == "-m") {
      if (process.argv[index + 1] == undefined) {
        throw "Challenge text is required (-m)";
      }
      challenge = process.argv[index + 1];
    }
  });
}

function getBaitWords() {
  process.argv.forEach(function (val, index) {
    if (val == "-b") {
      if (process.argv[index + 1] == undefined) {
        throw "At least 1 bait word required (-b)";
      }
      bait = process.argv[index + 1];
    }
  });
}

function getTranslate() {
  process.argv.forEach(function (val, index) {
    if (val == "-t") {
      if (process.argv[index + 1] == undefined) {
        throw "Translate is required (-t)";
      }
      translate = process.argv[index + 1];
    }
  });
}

async function main() {
  getChallengeText();
  getBaitWords();
  getTranslate();

  if (challenge + bait + translate == "") {
    throw "Fill all required flags (-m challenge) (-b bait words) (-t translate)";
  }

  const newChallenge = shuffle([...challenge.split(" "), ...bait.split(" ")]);

  await prisma.challenge.create({
    data: {
      type: "sentence",
      challenge: {
        create: {
          translate,
          sentence: newChallenge,
          correct: challenge,
        },
      },
    },
  });

  console.log("Done!");
  console.log(
    `Added new challenge with this fields: ${
      (JSON.stringify({
        translate,
        newChallenge,
        challenge,
      }),
      null,
      2)
    }`,
  );

  prisma.$disconnect();
}

await main();
