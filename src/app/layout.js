
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";

export const metadata = {
    title: "VyaparSathi",
    description: "Indian Vendor Companion App",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </head>
            <body>
                <LanguageProvider>
                    <div className="app-container">
                        {children}
                    </div>
                </LanguageProvider>
            </body>
        </html>
    );
}
