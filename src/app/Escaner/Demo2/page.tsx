'use client'
import { Label } from "@/components/ui/label";
import Html5QrcodePlugin from "./Components/camera";
import React from "react";

export default function Escaner2Page() {

    const [decodedText, setDecodedText] = React.useState<string>();
    const [decodedResult, setDecodedResult] = React.useState<string>();

    const onNewScanResult = (decodedTextR:string, decodedResultR:string) => {
        setDecodedText(decodedTextR);
        setDecodedResult(decodedResultR);
    };

    return (
        <div className="App">
            <Label>{decodedText}</Label>
            <Label>{decodedResult}</Label>
            <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
            />
        </div>
    );
  }