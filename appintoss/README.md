# 오늘운세 — 앱인토스(App-in-Toss) 버전

토스 미니앱으로 올리기 위한 **Granite(web-framework) + rsbuild 클라이언트 SPA** 버전.
`../web`(Next.js)의 엔진·데이터·화면을 이식했습니다.

## 구조
```
appintoss/
  granite.config.ts     앱인토스 미니앱 설정(appName, brand, 색/아이콘)
  rsbuild.config.ts     번들러 설정
  index.html            SPA 진입 HTML
  src/
    index.tsx           React 마운트
    App.tsx             화면 전환(state) + 하단탭 + 프로필(localStorage)
    index.css           디자인 시스템(점신풍 보라)
    lib/                엔진 (funtoday·saju·content·tojeong·myeongri·juyeok·fun·profile·brand)
    data/               content.json(경량화 1MB) · catalog.json
    screens/            Home·Ranking·Fun·Lotto·Bio·NameScreen·Gunghap·Juyeok
    components/         ShareCard·CaptureShare·ExpandableText·ProfileForm·ProfileBar·BottomNav·ThemeToggle·Reading
```

## 개발/빌드
```bash
cd appintoss
npm install
npm run webdev     # rsbuild dev (브라우저 미리보기, 포트 3941)
npm run rsbuild    # 웹 번들 빌드 (dist/)
# 실제 미니앱 구동/테스트는 아래 앱인토스 CLI + 샌드박스 앱 필요
npm run dev        # granite dev (토스 샌드박스 앱 연결 필요)
npm run build      # granite build
npm run deploy     # ait deploy (앱인토스 콘솔 등록 후)
```

## 아직 남은 것 (앱인토스 정식 출시용)
- **앱인토스 콘솔 가입 + 앱 등록** (본인 토스 계정, 만 19세+)
- **샌드박스 앱 설치** 후 `granite dev`로 실기 테스트
- **TDS(토스 디자인 시스템)** 정합성 최종 대조 (비게임 미니앱 검수 기준)
- **뒤로가기/나가기**를 토스 상단 네비와 연동 (SDK 브릿지)
- **공유**를 앱인토스 share API로 교체(현재는 html-to-image 이미지 미리보기)
- `granite.config.ts`의 **아이콘 URL**을 실제 업로드 아이콘으로 교체
- content.json 추가 경량화(현재 gz 248KB)

> 참고: 웹 번들(rsbuild)은 빌드·렌더 검증 완료. `granite`/샌드박스 구동은 사용자 토스 계정·샌드박스 앱이 있어야 확인 가능.
