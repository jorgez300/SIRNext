"use server";
import fs from "fs";
import path from "path";

export const GuardaArchivo = (base64: string, filename: string) => {
  const buffer = Buffer.from(base64, "base64");

  // Define la ruta donde quieres guardar el archivo
  const filePath = path.join(process.cwd(), "uploads", filename);

  fs.writeFile(filePath, buffer, () => {
    console.log("ok");
  });
};

/*export const RetornaArchivo = async (filename: string) => {
    const filePath = path.join(process.cwd(), "uploads", filename);

    fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
        if (err) {
          console.log(`Error reading file: ${err.message}`);
        }
        return data;
      });
};*/

export const RetornaArchivo = (filename: string): Promise<string> => {
  return new Promise((resolve) => {
    const filePath = path.join(process.cwd(), "uploads", filename);
    fs.readFile(filePath, { encoding: "base64" }, (err, data) => {
      if (err) {
        console.log(`Error reading file: ${err.message}`);
      }
      data = data.replace('dataimage/pngbase64', 'data:image/png;base64,')
      resolve(data);
    });
  });
};
