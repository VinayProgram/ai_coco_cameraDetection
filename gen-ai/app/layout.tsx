import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
      <body>
        {children}
      </body>
    </html>
  );
}
