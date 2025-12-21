import "./globals.css";
import type { Metadata } from "next";
import { ReduxProvider } from "./ReduxProvider";
import { ToastProvider } from "./ToastProvider";

export const metadata: Metadata = {
  title: "Construction Dashboard",
  description: "Construction dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children} <ToastProvider />
        </ReduxProvider>
      </body>
    </html>
  );
}
