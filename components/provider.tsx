"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "./ui/color-mode";
import { ThemeProviderProps } from "next-themes";
import { system } from "@/app/theme";
import { SessionProvider } from "next-auth/react";

export function Provider({ children }: ThemeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <SessionProvider>{children}</SessionProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}
