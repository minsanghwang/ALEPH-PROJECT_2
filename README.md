# ALEPH-PROJECT_2 · BaliExpress 본사 보안 인프라 구축 기록

쇼핑몰 회사(BaliExpress) 본사의 업무 시스템을 방화벽·VPN·IPS/IDS·WAF·SWG·SIEM으로 보호하고, 데이터센터와 연동한 뒤 AI Agent로 보안 조사를 돕는 환경을 가상 환경(GNS3 + VirtualBox)에서 구축·시험한 기록입니다.

## 읽는 순서

1. [`index.html`](index.html) — 전체 문서 (요약 → 기술 역량 → 고객 문제·역할 → 구성도·주소표 → 구역별 설명 → 설계 이유 → 시험 결과 → 문제 해결 사례 → 한계)
2. [`img/`](img/) — 구성도 8장 (SVG와 PNG)
   - `00-overview` 전체 토폴로지
   - `01-edge-vpn` 외부·경계·VPN
   - `02-security` 보안 계층(방화벽·IPS/IDS·WAF·SWG)
   - `03-staff` 직원망
   - `04-servers` 서버망
   - `05-mgmt-logs` 관리·로그·백업
   - `06-erp-integration` ERP와 데이터센터 연동
   - `07-ai-agent` AI Agent
3. [`evidence/`](evidence/) — 시험 증거
   - `agent-tests/test-report.md` Agent 자체 시험 결과
   - `agent-real-model/` 실제 모델로 조사한 보고서 4건

## 보는 방법

- 로컬에서는 `index.html`을 브라우저로 열면 됩니다(같은 폴더의 `img/`를 함께 둡니다).
- 웹에서 보려면 저장소 Settings → Pages에서 `main` 브랜치 루트를 지정하면 `index.html`이 페이지로 열립니다.
- 인쇄(PDF 저장)용 스타일이 들어 있어 브라우저의 "PDF로 저장"으로 A4 문서를 만들 수 있습니다.

## 구성도 다시 만들기

`gen/`의 Node 스크립트로 SVG를 만들고(`node gen/build.mjs`), `gen/render.ps1`로 PNG를 만듭니다. 외부 라이브러리는 쓰지 않습니다.

## 공개하면서 지운 것

비밀번호, VPN 공유키, 데이터센터 연동 키, API 키, 인증서 개인키·지문, 계정 정보. 실제 공인 대역 주소는 문서용 대역으로 바꿔 표기했고, 팀원 실명은 넣지 않았습니다. 10.x 내부 주소는 실제 값입니다.
