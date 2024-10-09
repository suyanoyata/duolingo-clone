import { ChallengeType, Lesson, Select, Sentence } from "@prisma/client";

export type SentenceWord = {
  id: number;
  text: string;
  isAvailable: boolean;
};

export type GameLesson = {
  type: ChallengeType;
  Select: Select[] | undefined;
  Sentence: Sentence[] | undefined;
} & Lesson;
