import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'oneul-unse',
  web: {
    host: 'localhost',
    port: 3939,
    commands: {
      dev: 'rsbuild dev',
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
