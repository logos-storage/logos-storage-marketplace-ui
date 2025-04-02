/// <reference types='vite/client' />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  VITE_CODEX_API_URL: string;
  VITE_GEO_IP_URL: string;
  VITE_DISCORD_LINK: string;
  VITE_CODEX_SELF_HOSTED: string;
}

interface ImportMeta {
  readonly PACKAGE_VERSION: string;
  readonly env: ImportMetaEnv;
}
