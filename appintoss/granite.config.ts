import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'unse4uu',
  web: {
    // 실기(폰) 테스트: 내 PC의 같은 Wi-Fi IP로 교체하세요.
    // (터미널에서 rsbuild가 출력하는 Network 주소, 또는 ipconfig의 IPv4 주소)
    host: '192.168.0.73',
    port: 3939,
    commands: {
      // 실기기에서 접속하려면 --host 로 외부 바인딩 + 포트를 web.port(3939)와 일치
      dev: 'rsbuild dev --host 0.0.0.0 --port 3939',
      build: 'rsbuild build',
    },
  },
  permissions: [],
  outdir: 'dist',
  brand: {
    displayName: '인생역점',
    icon: 'https://static.toss.im/appsintoss/60161/02d3926b-efa5-4393-912a-4758a812acdc.png',
    primaryColor: '#7b5cff',
    bridgeColorMode: 'inverted',
  },
  webViewProps: {
    type: 'partner',
  },
});
