import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import lightTheme from "./light.theme";
import { CssBaseline } from "@mui/material";
import Navbar from "./components/organisms/NavBar";
import CartPanel from './components/organisms/CartPanel';
import Footer from './components/organisms/Footer';

// Metadata
export const metadata: Metadata = {
  title: "Grum's Subshoppe",
  description: "Best Subshoppe in Cleveland",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>

      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Navbar />
            {children}
            <Footer />
            <CartPanel />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
