# 오늘운세 (unse02)

**매일 가볍게 확인하고 SNS에 공유하는** 데일리 운세 웹앱.
`unse01`의 만세력 엔진·콘텐츠 DB는 재활용하되, 진지한 사주 도구가 아니라
**스낵형 오늘의 운세 + 이미지 카드 공유**에 집중했습니다.

## 특징
- **오늘의 운세 카드** — 생년월일 1회 등록 → 매일 **총운 점수(0~100) + 키워드/이모지 + 애정·금전·직장 간단운 + 행운의 색·숫자·아이템**
- **이미지로 SNS 공유** — 결과 카드를 PNG로 캡처해 인스타 스토리·카톡 등에 공유/저장 (`html-to-image` + Web Share API)
- **오늘의 랭킹** — 띠 12·별자리 12 오늘 운세 순위, 내 띠/별자리 하이라이트
- **재미 운세** — 로또 번호·바이오리듬·이름 궁합·궁합·주역 뽑기
- **밝고 친근한 디자인** — 파스텔·코랄, 둥근 카드, 라이트/다크, 모바일 우선(3탭)
- **광고 자리(구조만)** — AdSlot placeholder (실제 광고 연동은 미포함)

## 점수 산출
`lib/funtoday.ts` — 정통 명리 길흉(`dailyMyeongri`, 내 일간 × 오늘 일진의 십신·십이운성)을
기반으로 0~100 점수를 결정적으로 산출. 같은 사람은 같은 날 항상 같은 결과, 날짜가 바뀌면 매일 갱신.

## 기술 스택
- Next.js 15 (App Router) + React 19 + TypeScript
- lunar-typescript (만세력) · html-to-image (카드 캡처)
- 콘텐츠 JSON은 서버 컴포넌트에서 서빙, 프로필은 localStorage + URL 파라미터

## 실행
```bash
cd web
npm install
npm run dev        # http://localhost:3939
npm run build
```

## 구조
```
web/
  app/
    page.tsx          온보딩 + 오늘의 운세 카드(홈)
    ranking/          띠·별자리 오늘 랭킹
    fun/              재미 허브 + lotto/bio/name
    gunghap/ juyeok/  궁합·주역 뽑기
    components/       ShareCard, CaptureShare, ProfileForm, ProfileBar,
                      AutoFill, BottomNav, ThemeToggle, AdSlot, Reading
  lib/                funtoday(데일리 엔진), saju, content, tojeong,
                      myeongri, fun, juyeok, profile, brand
  data/               catalog / content JSON (unse01에서 재활용)
```

## 재활용 원본
콘텐츠 DB·ETL·엔진 원본은 `../unse01` 참조. 정통 사주·토정·대운 등 무거운 기능은
이 버전에서 제외했으나, 엔진(`lib/*`)·데이터(`data/*`)는 남아 있어 필요 시 부활 가능합니다.
