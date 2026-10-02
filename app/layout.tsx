import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "OMO — Life no get manual.", description: "A Nigerian life simulation game." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}