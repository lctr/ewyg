import type { snelConfig } from "https://deno.land/x/snel/mod.ts";

export default <snelConfig> {
  root: "src/components/App.svelte",
  port: 3000,
  mode: "dom",
  plugins: [],
  extendsImportMap: [],
};
