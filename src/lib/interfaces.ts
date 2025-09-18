export const Group = {
  SCIENCE: "SCIENCE",
  HUMANITY: "HUMANITY",
  COMMERCE: "COMMERCE",
  ARTS: "ARTS",
  NONE: "NONE",
} as const;

export type Group = (typeof Group)[keyof typeof Group];
