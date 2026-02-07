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
3. 관리자 페이지에서 이메일/비밀번호로 로그인
4. 데이터 모드에 `인증 모드: Firebase Auth` 표시 확인

`firebase-config.js` 값이 비어 있거나 Firebase 연결 실패 시 자동으로 `localStorage` 모드로 동작합니다.
이 경우 관리자 로그인은 비활성 상태입니다.

## 예약 캘린더 + 알림(3단계)

1. 관리자 페이지에서 월별 예약 캘린더 확인
2. 날짜 클릭 시 해당 날짜 예약만 필터링
3. `예약 알림`에서 대기 예약 및 48시간 이내 예약 우선 확인
