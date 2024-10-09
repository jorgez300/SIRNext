"use server";

export const ObtieneVariable = async (key: string): Promise<string> => {
  return process.env[key]!;
};

export const ObtieneMultiplesVariables = async (
  keys: string[]
): Promise<string[]> => {
  const values: string[] = [];

  keys.forEach((key) => {
    values.push(process.env[key]!);
  });

  return values;
};
