"use client";
import { Label } from "@/components/ui/label";
import Html5QrcodePlugin from "./Components/camera";
import React from "react";

export default function Escaner2Page() {
  const [decodedText, setDecodedText] = React.useState<unknown>();
  const [decodedResult, setDecodedResult] = React.useState<unknown>();

  const onNewScanResult = (decodedTextR: unknown, decodedResultR: unknown) => {
    setDecodedText(decodedTextR);
    setDecodedResult(decodedResultR);
  };

  return (
    <div className="App">
      <Label>{JSON.stringify(decodedText)}</Label>
      <Label>{JSON.stringify(decodedResult)}</Label>
      <Html5QrcodePlugin
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
    </div>
  );
}
