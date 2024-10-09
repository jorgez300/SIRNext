// file = Html5QrcodePlugin.jsx
"use client";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

type CameraProps = {
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback?: (decodedText: string, decodedResult: unknown) => void;
};

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: CameraProps) => {
  const config: Html5QrcodeScannerConfig = {
    fps: props.fps,
  };
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin = (props: CameraProps) => {

  
  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    html5QrcodeScanner.render(props.qrCodeSuccessCallback, () => {
      return;
    });

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return (
    <>
      <div id={qrcodeRegionId} />
    </>
  );
};

export default Html5QrcodePlugin;
