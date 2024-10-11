export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SIR - Sistema Inventario de Respuestos</title>
      </head>
      {children}
    </html>
  );
}
