import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 프론트엔드에서 /api로 시작하는 요청은 스프링부트(8080)로 보냅니다.
      // 스프링부트에서 # Tomcat server.port=8090으로 변경하였기에 아래도 수정해준다.
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 빌드 결과물(index.html, js 등)이 스프링의 static 폴더로 바로 들어가도록 설정합니다.
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
});