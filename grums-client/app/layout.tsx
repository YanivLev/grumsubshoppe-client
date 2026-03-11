import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import lightTheme from "./light.theme";
import { CssBaseline } from "@mui/material";
import Container from "@mui/material/Container";
import Navbar from "./components/organisms/NavBar";


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
            <Navbar/>
            <Container>
              {children}
            </Container>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body> 
    </html>
  );
}
