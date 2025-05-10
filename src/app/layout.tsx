import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Micro App with RSC",
  description: "Micro application using React Server Components",
};

export default function MicroAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* When running standalone */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-700">Micro App</h2>
            <p className="text-sm text-gray-500">
              Using React Server Components
            </p>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
