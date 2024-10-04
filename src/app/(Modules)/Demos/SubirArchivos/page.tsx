"use client";
import { UploadIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { GuardaArchivo, RetornaArchivo } from "@/domain/Helpers/ArchivosHelper";

export default function SubirArchivoPage() {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageSrc2, setImageSrc2] = useState<string>("");

  useEffect(() => {
    ObtieneImagenDefault();
  });

  const ObtieneImagenDefault = () => {
    RetornaArchivo("TypeScript Types.png").then((result) => {
        console.log('RetornaArchivo',result);
        setImageSrc(result);
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        setImageSrc(base64String);
        //GuardaArchivo(base64String, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('GuardaArchivo',base64String);
        setImageSrc2(base64String);
        //GuardaArchivo(base64String, file.name);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <div className="">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" onChange={handleImageChange} />
          <Image
            src={imageSrc == "" ? "/placeholder.svg" : imageSrc}
            width={500}
            height={500}
            alt="Picture of the author"
          />
        </div>
        <div className="">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <Card>
                <CardContent className="grid grid-cols-1 py-4">
                  <div className="flex justify-center">
                    <UploadIcon />
                  </div>
                  <div className="flex justify-center">
                    <Label>Suelte los archivos para adjuntar</Label>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="grid grid-cols-1 py-4">
                  <div className="flex justify-center">
                    <UploadIcon />
                  </div>
                  <div className="flex justify-center">
                    <Label>Arrastre los archivos para adjuntar</Label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <Image
            src={imageSrc2 == "" ? "/placeholder.svg" : imageSrc2}
            width={500}
            height={500}
            alt="Picture of the author"
          />
        </div>
      </div>
    </div>
  );
}
