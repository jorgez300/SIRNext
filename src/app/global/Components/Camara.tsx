import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
const qrcodeRegionId = "html5qr-code-full-region";

type EscanerProductoProps = {
  camaraActiva: boolean;
  decodedText?: string;
  setCamaraActiva: (flag: boolean) => void;
  setDecodedText: (decodedTextR: string) => void;
};
let DetenerCamara: () => void;

export function EscanerProducto(props: Readonly<EscanerProductoProps>) {
  const onNewScanResult = (decodedTextR: string, decodedResultR: unknown) => {
    props.setDecodedText(decodedTextR);

    console.log(decodedTextR, decodedResultR);

    DetenerCamara();
  };

  const InitCamera = () => {
    if (props.camaraActiva) {
      const config: Html5QrcodeScannerConfig = {
        fps: 30,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.777778,
        disableFlip: true,
      };

      const html5QrcodeScanner = new Html5QrcodeScanner(
        qrcodeRegionId,
        config,
        false
      );

      html5QrcodeScanner.render(onNewScanResult, () => {
        return;
      });

      DetenerCamara = () => {
        html5QrcodeScanner.clear().then(() => {
          props.setCamaraActiva(false);
        });
      };

      return () => {
        html5QrcodeScanner.clear().catch((error) => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      };
    }
  };


  return (
    <Dialog open={props.camaraActiva}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Escanear</DialogTitle>
          <DialogDescription>
            {props.decodedText
              ? "Resultado: " + props.decodedText
              : "Escanee para mostrar resultado"}
          </DialogDescription>
        </DialogHeader>

        <div id={qrcodeRegionId} />

        <DialogFooter>
          <Button
            onClick={() => {
              InitCamera();
            }}
          >
            Iniciar
          </Button>
          <Button
            onClick={() => {
              DetenerCamara();
            }}
          >
            Detener
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
