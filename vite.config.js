import { defineConfig } from "vite";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import injectHTML from "vite-plugin-html-inject";

export default defineConfig({
  base: "/galef/",
  root: "src",
  publicDir: "../public",

  // Додано масив плагінів
  plugins: [
    injectHTML(),
    createSvgIconsPlugin({
      // Шлях до папки з іконками (створи її, якщо немає: src/assets/icons)
      iconDirs: [resolve(__dirname, "src/assets/icons")],
      symbolId: "icon-[name]",
      // Плагін вичищає жорсткі кольори з SVG, щоб працював CSS currentColor

      svgoOptions: false,
    }),
  ],

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        catalog: resolve(__dirname, "src/pages/catalog.html"),
        product: resolve(__dirname, "src/pages/product.html"),
        checkout: resolve(__dirname, "src/pages/checkout.html"),
        "order-success": resolve(__dirname, "src/pages/order-success.html"),
        search: resolve(__dirname, "src/pages/search.html"),
        wishlist: resolve(__dirname, "src/pages/wishlist.html"),
        sales: resolve(__dirname, "src/pages/sales.html"),
        "text-page": resolve(__dirname, "src/pages/text-page.html"),
        about: resolve(__dirname, "src/pages/about.html"),
        delivery: resolve(__dirname, "src/pages/delivery.html"),
        "where-to-buy": resolve(__dirname, "src/pages/where-to-buy.html"),
        security: resolve(__dirname, "src/pages/security.html"),
        terms: resolve(__dirname, "src/pages/terms.html"),
        "user-agreement": resolve(__dirname, "src/pages/user-agreement.html"),
        returns: resolve(__dirname, "src/pages/returns.html"),
        404: resolve(__dirname, "src/pages/404.html"),
        "ui-kit": resolve(__dirname, "src/pages/ui-kit.html"),
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `@use "scss/abstracts" as *;\n`,
        loadPaths: [resolve(__dirname, "src")],
      },
    },
  },
});
