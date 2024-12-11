"use client"

import { ChakraProvider, defineConfig, defaultConfig, defaultSystem, createSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
    semanticTokens: {
      fonts: {
        heading: { value: "Space Grotesk, sans-serif" },
        body: { value: "DM Sans, sans-serif" }
      }
    }
  },
})

const system = createSystem(config,defaultConfig)

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
