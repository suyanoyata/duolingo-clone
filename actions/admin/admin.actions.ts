"use server";

import { verifySession } from "@/lib/session-helper";
import { CourseCreateFormData } from "@/types/Forms";
import { Lesson, PrismaClient, Unit } from "@prisma/client";

const db = new PrismaClient();

const isPermittedAction = async () => {
  const session = await verifySession();

  const exists = await db.user.findFirst({
    where: {
      id: session.data.id,
      isAdmin: true,
    },
  });

  if (!exists) {
    return {
      success: false,
      message: "Недостатньо прав для виконання цієї дії",
    };
  }

  return {
    success: true,
  };
};

const createCourse = async (course: CourseCreateFormData) => {
  const permitted = await isPermittedAction();

  if (!permitted.success) {
    return {
      success: false,
      message: permitted.message,
    };
  }

  const exists = await db.language.findFirst({
    where: {
      OR: [
        {
          name: course.course_name,
        },
        {
          code: course.course_code,
        },
      ],
    },
  });

  if (exists) {
    return {
      success: false,
      message: "Такий курс вже існує",
    };
  }

  const language = await db.language.create({
    data: {
      name: course.course_name,
      code: course.course_code,
    },
  });

  return {
    success: true,
    data: language,
  };
};

const editUnit = async (unit: Unit) => {
  const permitted = await isPermittedAction();

  if (!permitted.success) {
    return {
      success: false,
      message: permitted.message,
    };
  }

  const updatedUnit = await db.unit.update({
    where: {
      id: unit.id,
    },
    data: {
      name: unit.name,
      description: unit.description,
    },
  });

  return {
    success: true,
    data: updatedUnit,
  };
};

const editLesson = async (lesson: Lesson) => {
  const permitted = await isPermittedAction();

  if (!permitted.success) {
    return {
      success: false,
      message: permitted.message,
    };
  }

  const updatedLesson = await db.lesson.update({
    where: {
      id: lesson.id,
    },
    data: {
      isLessonVisible: lesson.isLessonVisible,
    },
  });

  return {
    success: true,
    data: updatedLesson,
  };
};

export { createCourse, editUnit, editLesson };
