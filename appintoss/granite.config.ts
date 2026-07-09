import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'oneul-unse',
  web: {
    // 실기(폰) 테스트: 내 PC의 같은 Wi-Fi IP로 교체하세요.
    // (터미널에서 rsbuild가 출력하는 Network 주소, 또는 ipconfig의 IPv4 주소)
    host: '192.168.0.73',
    port: 3939,
    commands: {
      // 실기기에서 접속하려면 --host 로 외부 바인딩
      dev: 'rsbuild dev --host 0.0.0.0',
      build: 'rsbuild build',
    },
  },
  permissions: [],
  outdir: 'dist',
  brand: {
    displayName: '오늘운세',
    // TODO: 앱인토스 콘솔에 업로드한 실제 아이콘 URL로 교체
    icon: 'https://static.toss.im/appsintoss/73/10550764-5ac1-44e2-9ff3-ad78d8d2e71a.png',
    primaryColor: '#7b5cff',
    bridgeColorMode: 'inverted',
  },
  webViewProps: {
    type: 'partner',
  },
});
