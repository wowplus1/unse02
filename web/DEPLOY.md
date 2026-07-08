# Vercel 배포 (테스트용 공유)

이 앱을 공개 https 주소로 올려 어디서나 폰으로 테스트할 수 있게 합니다.
빌드는 통과 상태이며, 배포에 불필요한 파일은 정리해 두었습니다.

## 배포 방법 (터미널에서 3단계)

> ⚠️ 반드시 **web 폴더 안에서** 실행하세요. (앱이 `unse02/web/`에 있음)

```powershell
cd C:\Users\조지수\Desktop\unse02\web
npx vercel            # 첫 배포 (프리뷰 URL 생성)
npx vercel --prod     # 프로덕션 URL 생성
```

### `npx vercel` 실행 시 물어보는 것 (전부 기본값 Enter면 됩니다)
1. **Log in** — 브라우저가 열리며 GitHub/이메일 등으로 로그인 (최초 1회)
2. `Set up and deploy "web"?` → **Y**
3. `Which scope?` → 본인 계정 선택
4. `Link to existing project?` → **N**
5. `Project name?` → 그대로 Enter (예: `web`) 또는 `oneul-unse` 등으로 변경
6. `In which directory is your code located?` → **`./`** (Enter)
7. 프레임워크는 **Next.js** 로 자동 인식 → 빌드 설정 오버라이드 **N**

끝나면 `https://<프로젝트>.vercel.app` 주소가 출력됩니다. 이 링크를 폰/지인에게 공유해 테스트하면 됩니다. (https라서 "이미지로 공유" Web Share도 실제 동작)

## 참고
- 코드를 고친 뒤 다시 배포하려면 `web` 폴더에서 `npx vercel --prod` 만 다시 실행.
- 계정 없이도 `npx vercel` 이 안내에 따라 무료로 생성됩니다.
- 원하면 로그인 후 발급되는 **토큰**(`npx vercel login` → 대시보드의 Access Token)을 알려주시면, 이후 배포는 제가 대신 실행할 수 있습니다.
