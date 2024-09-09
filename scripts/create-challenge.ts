import { shuffle } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let challenge = "";

function getChallengeText() {
  process.argv.forEach(function (val, index) {
    if (val == "-m") {
      if (process.argv[index + 1] == undefined) {
        console.error("Challenge text is required");
        return;
      }
      challenge = process.argv[index + 1];
    }
  });
}

async function main() {
  getChallengeText();

  if (challenge == "") {
    console.error("Challenge text is required");
    return;
  }
  const sentence = shuffle(challenge.split(" "));

  const create = await prisma.challenge.create({
    data: {
      type: "sentence",
      challenge: {
        create: {
          sentence: sentence.join(" "),
          correct: challenge,
        },
      },
    },
  });

  console.log(create);

  prisma.$disconnect();
}

await main();
