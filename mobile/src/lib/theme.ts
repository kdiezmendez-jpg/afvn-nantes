// Identité visuelle partagée avec le site (app/globals.css).
export const colors = {
  night950: "#03141f",
  night900: "#061c2b",
  night800: "#0b2a3f",
  night700: "#123a55",
  teal: "#4fd1c5",
  gold200: "#f8e2b0",
  gold300: "#f4cd7a",
  gold400: "#efb54a",
  gold700: "#86591a",
  cream: "#f6f1e7",
  sage: "#e9eeea",
  white: "#ffffff",
  ink: "#11293b",
  muted: "#5d6b76",
  line: "rgba(17,41,59,0.12)",
  lineDark: "rgba(255,255,255,0.12)",
} as const;

export const fonts = {
  display: "PlayfairDisplay_600SemiBold",
  displayItalic: "PlayfairDisplay_500Medium_Italic",
  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
  bodyBold: "DMSans_700Bold",
} as const;

export const space = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
