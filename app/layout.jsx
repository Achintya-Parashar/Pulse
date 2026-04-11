import "./globals.css";

export const metadata = {
  title: "PULSE — Live Event Streaming",
  description: "Watch the world's biggest live events in real time",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-surface-bg text-[#f0f0fa] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

