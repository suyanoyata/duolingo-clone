"use client";

export const localDate = (date: Date) => {
  return Intl.DateTimeFormat("uk-UA", {
    month: "long",
    year: "numeric",
  }).format(date);
};
