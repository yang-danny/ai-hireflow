import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    {
      name: "chrome-devtools-fix",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (
            req.url === "/.well-known/appspecific/com.chrome.devtools.json"
          ) {
            res.statusCode = 204;
            res.end();
          } else {
            next();
          }
        });
      },
    },
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  
});
