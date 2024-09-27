'use client'
import Html5QrcodePlugin from "./Components/camera";

export default function Escaner2Page() {

    const onNewScanResult = (decodedText:unknown, decodedResult:unknown) => {
        console.log('decodedText',decodedText)
        console.log('decodedResult',decodedResult)
    };

    return (
        <div className="App">
            <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
            />
        </div>
    );
  }