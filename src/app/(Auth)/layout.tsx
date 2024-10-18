import Image from "next/image";

import "../globals.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">{children}</div>
        <div className="hidden bg-muted lg:block">
          <Image
            src="/Designer.png"
            alt="Image"
            width={600}
            height={600}
            className=" h-540 w-full dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </body>
  );
}
