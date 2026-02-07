# TRULY PILATES

정적 홈페이지 기반 운영 페이지입니다.

## Firebase 연동(1단계)

1. Firebase Console에서 프로젝트 생성
2. Firestore Database 생성(테스트 모드 또는 규칙 설정)
3. 웹 앱 등록 후 SDK 설정값 복사
4. `firebase-config.js`에 값 입력
5. 페이지 새로고침 후 관리자 섹션의 데이터 모드가 `Firebase Firestore`인지 확인

## 관리자 보안 강화(2단계)

1. Firebase Console > Authentication > Sign-in method에서 `Email/Password` 활성화
2. Authentication > Users에서 관리자 계정 생성
3. `firebase-config.js`의 `adminEmails`에 관리자 이메일 등록
4. `firestore.rules`의 `admin@example.com`을 실제 관리자 이메일로 교체
5. 관리자 페이지에서 이메일/비밀번호 로그인
6. 데이터 모드에서 `인증 모드: Firebase Auth` 및 allowlist 표시 확인

## 예약 캘린더 + 알림(3단계)

1. 관리자 페이지에서 월별 예약 캘린더 확인
2. 날짜 클릭 시 해당 날짜 예약만 필터링
3. `예약 알림`에서 대기 예약 및 48시간 이내 예약 우선 확인

## 배포(운영 반영)

1. Firebase CLI 설치: `npm i -g firebase-tools`
2. 로그인: `firebase login`
3. 프로젝트 연결: `firebase use --add`
4. 규칙 배포: `firebase deploy --only firestore:rules`
5. 호스팅 배포: `firebase deploy --only hosting`

## 운영 안정화(4단계)

1. 관리자 로그인 보호: 10분 내 5회 실패 시 15분 잠금
2. 관리자 계정은 `adminEmails` allowlist와 Firestore 규칙 이메일을 동일하게 유지
3. 분기별로 관리자 비밀번호 변경 및 불필요 계정 삭제
4. 배포 전 `firestore.rules` 검토 후 규칙 재배포

`firebase-config.js` 값이 비어 있거나 Firebase 연결 실패 시 자동으로 `localStorage` 모드로 동작합니다.
이 경우 관리자 로그인은 비활성 상태입니다.
