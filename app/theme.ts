"use client";

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--primary-font)" },
        body: { value: "var(--primary-font)" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
