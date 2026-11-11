import { Svg, COLOR } from './lib.mjs';

/* ---------- 02 보안 계층 ---------- */
export function security() {
  const s = new Svg(1500, 720);
  s.zone(20, 56, 230, 400, '사용자', COLOR.staff);
  s.zone(270, 56, 940, 400, '보안 장비 (통과 순서)', COLOR.sec);
  s.zone(1230, 56, 250, 400, '목적지', COLOR.srv);
  s.node('pc', 40, 190, 190, 130, ['직원 PC', '부서 VLAN', '업무 웹: 사내 도메인', '일반 웹: 프록시 자동 설정(WPAD)'], { stroke: '#4b9a63' });
  // 흐름 1: 업무 웹
  s.node('acl', 290, 100, 180, 96, ['Core ACL', 'WAF-PROTECT', 'WAF로 가는 443·80만 허용', '그 밖의 직접 접근 차단']);
  s.node('waf', 500, 100, 210, 96, ['WAF', 'nginx + ModSecurity(OWASP CRS)', 'TLS 종단 · 차단 모드', 'SQLi·XSS 요청은 403']);
  // 흐름 2: 일반 웹
  s.node('swg', 500, 330, 210, 96, ['SWG', 'Squid 프록시 + WPAD', '차단 목록 · 사설 대역 차단', '목적지 도메인 기록']);
  // 공통
  s.node('ipsa', 750, 100, 170, 326, ['IPS 인라인', '쌍 A', 'pfSense e1 ↔ Transit_SW', '', 'Suricata 사용자 규칙', 'EVE 로그 → SIEM'], { stroke: '#c0463f', sw: 2 });
  s.node('fw', 960, 100, 220, 326, ['pfSense 방화벽', '인터페이스별 최소 허용', '기본 차단 + 기록', '(Egress default deny)', '', 'IPsec 탭: 필요한 포트만', '', '사이트 간 VPN 종단', '인터넷 방향 NAT'], { fill: '#fff', stroke: '#c0463f', sw: 2.4 });
  s.node('ipsb', 1245, 100, 220, 70, ['IPS 인라인 · 쌍 B', 'pfSense e3 ↔ LOG_SW']);
  s.node('erp', 1245, 200, 220, 96, ['ERP-WEB · IT-DB', 'Apache는 WAF 주소만 허용', 'DB 3306은 ERP-WEB만', '서버 구역 10.14.90.0/24']);
  s.node('inet', 1245, 330, 220, 96, ['인터넷', '허용 목록 방식', '서버는 직접 나갈 수 없음', 'SWG만 80·443 통과']);
  s.link([s.p('pc', 'r', -45), [262, 242], [262, 148], s.p('acl', 'l')], { label: '업무 웹' });
  s.link([s.p('acl', 'r'), s.p('waf', 'l')]);
  s.link([s.p('waf', 'r'), [750, 148]]);
  s.link([[920, 148], [960, 148]]);
  s.link([[1180, 135], [1245, 135]]);
  s.link([s.p('ipsb', 'b'), s.p('erp', 't')]);
  s.link([s.p('pc', 'r', 45), [262, 290], [262, 378], s.p('swg', 'l')], { label: '일반 웹' });
  s.link([s.p('swg', 'r'), [750, 378]]);
  s.link([[920, 378], [960, 378]]);
  s.link([[1180, 378], s.p('inet', 'l')]);
  // 아래 설명
  s.node('ids', 290, 490, 280, 100, ['IDS (Suricata, 패시브)', 'WAN 구간의 TAP 허브에서 복사한', '트래픽을 탐지만 한다(차단 안 함)'], { fill: '#fff' });
  s.node('hfw', 590, 490, 280, 100, ['호스트 방화벽', 'firewalld / ufw + Apache 접근 제한', '서버마다 필요한 출발지만 허용', '관리 NIC는 SSH 출발지 제한'], { fill: '#fff' });
  s.node('leak', 890, 490, 300, 100, ['유출 통제', '허용 목록 방식(본문 검사 없음)', '금지 목적지는 Suricata 시그니처', '(LEAK-DEST)로 경보'], { fill: '#fff' });
  s.node('obs', 1210, 490, 270, 100, ['관측', 'ModSecurity · Squid · pfSense · IPS', '로그가 모두 LogSRV로 모여', 'Wazuh 규칙으로 경보'], { fill: '#fff' });
  s.text(24, 636, ['설계 원칙: 한 장비에 모든 것을 맡기지 않고 경계(pfSense), 웹(WAF), 단말 웹(SWG), 서버(호스트 방화벽)의 여러 겹으로 막고, 막은 사실도 기록으로 남긴다.'], { size: 13, fill: COLOR.muted });
  s.legend(1130, 600);
  return s.toString('구역 2 · 보안 계층: 방화벽, IPS/IDS, WAF, SWG');
}

/* ---------- 03 직원망 ---------- */
export function staff() {
  const s = new Svg(1320, 720);
  s.zone(20, 56, 1280, 640, '직원망: 이중화된 L3 코어와 부서별 VLAN', COLOR.staff);
  s.node('tr', 40, 90, 250, 70, ['Transit_SW', '10.14.0.32/29', 'pfSense · WAF · SWG와 코어를 연결']);
  s.node('core', 330, 90, 620, 70, ['Core-SW1 / Core-SW2 (L3)', 'Vlan400(Transit)로 방화벽 방향 경로 · 서버 대역 10.14.90.0/24 정적 경로', 'WAF 보호 ACL을 Transit 쪽에 적용']);
  s.node('d1', 60, 230, 210, 80, ['Dist-SW1', 'HSRP 활성', 'VLAN 410·420 게이트웨이 .2']);
  s.node('d2', 290, 230, 210, 80, ['Dist-SW2', 'HSRP 대기', 'VLAN 410·420 게이트웨이 .3']);
  s.node('d3', 640, 230, 210, 80, ['Dist-SW3', 'HSRP 활성', 'VLAN 430·440·450 .2']);
  s.node('d4', 870, 230, 210, 80, ['Dist-SW4', 'HSRP 대기', 'VLAN 430·440·450 .3']);
  s.node('a1', 40, 390, 170, 70, ['Access-SW1', 'DEV · VLAN 410'], { fill: '#f6fff8' });
  s.node('a2', 250, 390, 170, 70, ['Access-SW2', 'ADM · VLAN 420'], { fill: '#f6fff8' });
  s.node('a3', 560, 390, 170, 70, ['Access-SW3', 'HRF · VLAN 430'], { fill: '#f6fff8' });
  s.node('a4', 770, 390, 170, 70, ['Access-SW4', 'SHOP · VLAN 440'], { fill: '#f6fff8' });
  s.node('a5', 980, 390, 170, 70, ['Access-SW5', 'CS · VLAN 450'], { fill: '#f6fff8' });
  const pcs = [['a1', 40, 'DEV PC 5대', '10.14.10.0/24'], ['a2', 250, 'ADM PC 5대', '10.14.20.0/24'], ['a3', 560, 'HRF PC 5대', '10.14.30.0/24'], ['a4', 770, 'SHOP PC 4대', '10.14.40.0/24'], ['a5', 980, 'CS PC 5대', '10.14.50.0/24']];
  for (const [id, x, t1, t2] of pcs) { s.node('p' + id, x, 520, 170, 60, [t1, t2], { stroke: '#4b9a63' }); s.link([s.p(id, 'b'), s.p('p' + id, 't')], { arrow: 'none' }); }
  s.link([s.p('tr', 'r'), s.p('core', 'l')], { arrow: 'none' });
  for (const id of ['d1', 'd2', 'd3', 'd4']) s.link([[s.p(id, 't')[0], 160], s.p(id, 't')], { arrow: 'none' });
  s.link([[165, 160], [165, 190], [1000, 190], [1000, 160]], { arrow: 'none' });
  s.link([[395, 190], [395, 160]], { arrow: 'none' });
  s.link([s.p('d1', 'r'), s.p('d2', 'l')], { arrow: 'none', dash: true });
  s.link([s.p('d3', 'r'), s.p('d4', 'l')], { arrow: 'none', dash: true });
  for (const [id, x] of [['a1', 125], ['a2', 335]]) { s.link([[s.p('d1', 'b')[0] + (id === 'a1' ? -40 : 40), 310], [s.p(id, 't')[0] - (id === 'a1' ? 20 : 20), 390]], { arrow: 'none' }); s.link([[s.p('d2', 'b')[0] + (id === 'a1' ? -40 : 40), 310], [s.p(id, 't')[0] + 20, 390]], { arrow: 'none' }); }
  for (const id of ['a3', 'a4', 'a5']) { s.link([[s.p('d3', 'b')[0], 310], [s.p(id, 't')[0] - 15, 390]], { arrow: 'none' }); s.link([[s.p('d4', 'b')[0], 310], [s.p(id, 't')[0] + 15, 390]], { arrow: 'none' }); }
  s.node('n1', 40, 610, 380, 70, ['주소 · 프록시 자동 설정', 'DHCP 릴레이로 주소를 받고, DHCP 옵션 252(WPAD)로', '프록시 설정을 자동으로 받는다'], { fill: '#fff' });
  s.node('n2', 450, 610, 380, 70, ['이중화', 'Core 2대 · Dist 2쌍 · Access는 두 Dist에 연결', '한 대가 꺼져도 HSRP로 게이트웨이가 이어진다'], { fill: '#fff' });
  s.node('n3', 860, 610, 420, 70, ['직원의 통신 경로', '내부 서버: Dist → Core → ... → pfSense·IPS(서버 방향)', '업무 웹: WAF · 일반 웹: SWG 프록시만 허용'], { fill: '#fff' });
  s.legend(965, 84);
  return s.toString('구역 3 · 직원망: 코어, 배포, 접속 스위치와 부서 VLAN');
}

/* ---------- 04 서버망 ---------- */
export function servers() {
  const s = new Svg(1300, 640);
  s.zone(20, 56, 1260, 330, '서버 구역 VLAN 490 · 10.14.90.0/24 (게이트웨이 = pfSense 10.14.90.1)', COLOR.srv);
  s.node('up', 40, 96, 190, 70, ['pfSense · IPS 쌍 B', '10.14.90.1 (VLAN 490 게이트웨이)'], { stroke: '#c0463f' });
  s.node('agg', 40, 200, 190, 100, ['SRV-AGG', '서버 접속 스위치', '로그 구역(LOG_SW)을 거쳐', 'IPS 쌍 B → pfSense로 연결']);
  s.link([[135, 166], [135, 200]], { arrow: 'none', label: '트렁크', lx: 135, ly: 183 });
  s.node('dhcp', 270, 100, 220, 120, ['DHCP-Server .10', 'Rocky Linux 9', '직원 PC 주소 배포', '프록시 자동 설정 옵션']);
  s.node('dns', 510, 100, 220, 120, ['DNS-01 .12', 'Rocky Linux 9 · BIND', '사내 영역 hq.baliexpress.com', 'erp·shop 이름 → WAF']);
  s.node('cns', 750, 100, 240, 120, ['CNS .13', 'BIND 캐시·포워더', '사내 영역 → DNS-01', '서비스 DC 도메인 → VPN 너머 DNS', '그 밖 → 외부 DNS']);
  s.node('db', 270, 250, 220, 120, ['IT-DB .11', 'Rocky Linux 9 · MariaDB', 'ERP DB(hq_erp) · 감사 플러그인', '앱 계정은 표별 최소 권한']);
  s.node('erp', 530, 250, 220, 120, ['ERP-WEB .14', 'Rocky Linux 9 · Apache + PHP 8.0', '본사 업무 시스템', '로컬 DB 없음, IT-DB 사용']);
  s.link([[230, 250], [250, 250], [250, 235], [870, 235]], { arrow: 'none' });
  for (const x of [380, 620, 870]) s.link([[x, 235], [x, 220]], { arrow: 'none' });
  for (const x of [380, 640]) s.link([[x, 235], [x, 250]], { arrow: 'none' });
  s.link([[490, 310], [530, 310]], { arrow: 'both' });
  s.text(510, 394, 'ERP-WEB → IT-DB :3306', { size: 12, anchor: 'middle', fill: COLOR.muted });
  s.node('p1', 40, 420, 400, 130, ['서버 보호 (호스트 단)', 'firewalld 허용 목록: IT-DB 3306은 ERP-WEB만,', 'HTTP는 WAF 주소만. Apache도 Require ip로 한 번 더 제한', '관리 NIC는 SSH를 BackupSRV·관리 PC에서만 허용', 'root 로그인은 키 인증만, 인증 시도 3회로 제한'], { fill: '#fff' });
  s.node('p2', 470, 420, 400, 130, ['DB 권한 설계', '앱 계정 erp_app: 접속 출발지 ERP-WEB 1곳', '표별 읽기·쓰기만, 감사 기록 표는 추가·조회만', '관리자 계정 생성·권한 부여·삭제는 감사 로그로 남겨', 'SIEM 경보(규칙 100203)로 올라간다'], { fill: '#fff' });
  s.node('p3', 900, 420, 380, 130, ['요청이 서버까지 가는 길', '직원 → WAF(ModSecurity) → pfSense·IPS', '→ ERP-WEB(:80) → IT-DB(:3306)', '서버 구역의 모든 통신이 방화벽과 IPS를 거친다', '이름 확인은 직원 PC → CNS → DNS-01'], { fill: '#fff' });
  s.text(24, 596, ['서버 정리: 복제로 만든 서버의 호스트 이름·SSH 호스트 키를 서버마다 새로 만들고, 이전 프로젝트의 DB와 계정은 백업 후 정리했다.'], { size: 13, fill: COLOR.muted });
  s.legend(1010, 96);
  return s.toString('구역 4 · 서버망: DHCP, DNS, 캐시 DNS, DB, ERP 웹');
}

/* ---------- 05 관리 · 로그 · 백업 ---------- */
export function mgmtLogs() {
  const s = new Svg(1400, 760);
  s.zone(20, 56, 520, 640, '로그를 만드는 쪽', COLOR.srv);
  s.zone(560, 56, 440, 640, '수집 · 분석', COLOR.mgmt);
  s.zone(1020, 56, 360, 640, '관리 · 백업', COLOR.mgmt);
  const src = [
    ['fw', 'pfSense', '방화벽·VPN 이벤트 · syslog UDP 514'],
    ['ips', 'IPS (Suricata)', 'EVE JSON · rsyslog TCP 514'],
    ['swg', 'SWG (Squid)', '접속 기록(HTTPS는 도메인까지)'],
    ['waf', 'WAF', 'nginx 접속·오류 · ModSecurity 차단 · 에이전트'],
    ['erp', 'ERP-WEB', 'Apache 로그 · 앱 감사 기록 · 에이전트'],
    ['db', 'IT-DB', 'Apache · MariaDB 오류·감사 · 에이전트'],
    ['dns', 'DNS-01', 'BIND 질의 기록'],
  ];
  src.forEach(([id, a, b], i) => s.node('s_' + id, 40, 96 + i * 82, 480, 64, [a, b]));
  s.node('log', 590, 130, 380, 250, ['LogSRV (Wazuh 4.9.2)', '10.14.200.11 (관리망) · 10.14.210.11 (로그 구역)', '수집: rsyslog 514 / 에이전트 1514·1515', '', '사용자 정의 탐지 규칙', 'ERP 로그인 실패·반복·접근 거부 (100100~)', 'WAF 차단·반복 차단, DB 접속 거부 (100110~)', 'MariaDB 감사: 접속·DDL·계정 변경 (100200~)', '파일 무결성 변경(FIM) 경보'], { fill: '#fff', stroke: '#7d5fc4', sw: 2.2 });
  s.node('ai', 590, 420, 380, 110, ['AI Agent의 입력', '알림 파일(alerts.json)을 읽기 전용으로 조회', '규칙 판정 + 문서 근거로 조사 보고서 작성']);
  s.node('ntp', 590, 560, 380, 100, ['시간 동기', 'pfSense가 외부 NTP(kr.pool, google, cloudflare)에 동기', '서버는 모두 pfSense를 기준으로 맞춘다', '저장 상태에서 되살린 VM은 시계를 먼저 확인']);
  s.node('mg', 1040, 96, 320, 90, ['MGMT_SW1 (관리망 중심)', '10.14.200.0/24', '서버마다 두 번째 NIC (.21 ~ .27)']);
  s.node('bk', 1040, 220, 320, 140, ['BackupSRV (.15)', '점프 호스트: 서버 SSH는 여기서만', '설정·DB 백업과 SHA-256 목록', '복원 시험(임시 DB로 복원 후 행 수 비교)']);
  s.node('adm', 1040, 390, 320, 70, ['관리 PC (.101)', '승인된 관리 단말']);
  s.node('ssh', 1040, 490, 320, 120, ['접근 통제', 'SSH: 허용 사용자 목록 + 키 인증', '인증 시도 3회 · X11 전달 끔', 'root는 키 인증만, 출발지 BackupSRV', '파일 변경 감시: ERP·DB·WAF 에이전트']);
  src.forEach(([id], i) => s.link([[520, 128 + i * 82], [590, 128 + i * 82 < 400 ? 128 + i * 82 : 380]], { arrow: 'none' }));
  s.link([s.p('log', 'b'), s.p('ai', 't')], { arrow: 'none' });
  s.link([s.p('bk', 'l', -30), [1000, 250]], { arrow: 'none', dash: true, label: 'SSH', lx: 1010, ly: 250 });
  s.link([s.p('mg', 'b'), s.p('bk', 't')], { arrow: 'none' });
  s.text(24, 726, ['로그는 서버의 관리 NIC를 통해 LogSRV로 전달되며(서비스 NIC 경로와 분리), 보낸 서버가 잠시 끊겨도 큐에 쌓였다가 도착한다.'], { size: 13, fill: COLOR.muted });
  return s.toString('구역 5 · 관리, 로그, 백업: 관리망, SIEM, 백업, 시간 동기');
}

/* ---------- 06 ERP · 데이터센터 연동 ---------- */
export function erpIntegration() {
  const s = new Svg(1420, 760);
  s.zone(20, 56, 1380, 340, '본사 업무 시스템 (ERP)', COLOR.app);
  s.zone(20, 416, 1380, 300, '외부 데이터센터 (VPN 너머)', COLOR.ext);
  s.node('user', 40, 110, 180, 90, ['직원 브라우저', 'HTTPS · 역할별 메뉴', '(직원·담당자·관리자)']);
  s.node('waf', 260, 110, 170, 90, ['WAF', 'ModSecurity', 'TLS 종단']);
  s.node('erp', 470, 90, 430, 240, ['ERP-WEB (Apache + PHP 8.0)', '상품 · 재고 · 거래처 · 단가 · 구매 요청/발주/결재', '쇼핑몰 주문·환불 · 쇼핑몰 재고 · 물류 재고 화면', '보안: 서버 측 권한 검사 · CSRF 토큰 · 세션 쿠키 보안 속성', '입력은 매개변수화 쿼리, 출력은 인코딩', '상품 이미지 업로드: 확장자·내용·크기 검사, 웹 루트 밖 저장', '모든 변경은 감사 기록(DB + syslog)'], { fill: '#fff', stroke: '#2f7fb0', sw: 2.2 });
  s.node('db', 960, 110, 200, 90, ['IT-DB', 'MariaDB hq_erp', '표별 최소 권한 계정']);
  s.node('up', 960, 230, 200, 80, ['이미지 저장소', '/var/lib/erp/uploads', '웹 루트 밖 · 직접 접근 404']);
  s.node('sie', 1190, 110, 190, 90, ['LogSRV (SIEM)', '감사 이벤트 → 경보', 'DB 계정 변경·로그인 실패']);
  s.link([s.p('user', 'r'), s.p('waf', 'l')]);
  s.link([s.p('waf', 'r'), [470, 155]]);
  s.link([[900, 155], s.p('db', 'l')], { arrow: 'both', label: '3306' });
  s.link([[900, 270], s.p('up', 'l')]);
  s.link([[1160, 155], s.p('sie', 'l')], { dash: true, label: 'syslog' });
  s.node('svc', 470, 450, 430, 150, ['서비스 DC (쇼핑몰)', '연동 API :3000 · 헤더 X-Service-Key(파일로만 보관)', '읽기: 주문·환불·상품·재고', '쓰기: 상품 수정, 환불 승인·거절, 주문 취소', '쓰기는 상대에 먼저 요청 → 다시 읽어 확인 → ERP 반영'], { fill: '#fff' });
  s.node('log', 960, 450, 400, 150, ['물류 DC (재고 시스템 WMS)', 'HTTP API · 헤더 X-Service-Key(ERP 전용 키)', '읽기 전용: 재고 · 출고 · 반품 조회', '재고 수정은 물류 직원만(ERP는 보기 전용)', '실패 시 "조회 실패" 카드만 표시, 다른 기능 영향 없음'], { fill: '#fff' });
  s.node('vpn1', 60, 480, 360, 100, ['IPsec VPN (pfSense)', 'con1 → 서비스 DC · con2 → 물류 DC', '허용은 ERP-WEB 주소에서 필요한 포트만', '반대 방향(상대 → 본사)은 기본 차단'], { stroke: '#c0463f' });
  s.link([[685, 330], [685, 450]], { arrow: 'both', dash: true, color: '#c0463f', label: 'VPN con1', lx: 685, ly: 390 });
  s.link([[860, 330], [860, 380], [1160, 380], [1160, 450]], { arrow: 'both', dash: true, color: '#c0463f', label: 'VPN con2', lx: 1010, ly: 380 });
  s.text(24, 744, ['원칙: 연동 결과를 확인하기 전에는 성공으로 표시하지 않는다(상대의 상태가 원본). 키는 화면·로그·보고서에 내보내지 않는다.'], { size: 13, fill: COLOR.muted });
  return s.toString('구역 6 · ERP와 데이터센터 연동');
}

/* ---------- 07 AI Agent ---------- */
export function aiAgent() {
  const s = new Svg(1420, 780);
  s.zone(20, 56, 330, 640, '근거 자료', COLOR.mgmt);
  s.zone(370, 56, 700, 640, '', COLOR.app);
  s.text(384, 684, 'Agent: 조사 보조 · 읽기 전용', { size: 13, bold: true });
  s.zone(1090, 56, 310, 640, '결과', COLOR.staff);
  s.node('alerts', 40, 100, 290, 100, ['Wazuh 경보 (alerts.json)', 'LogSRV의 실제 경보', '(옮긴 14건으로 실제 조사)']);
  s.node('docs', 40, 240, 290, 110, ['운영 문서(RAG 자료)', '정책표 v0.2 · 이전 판 v0.1', '구성도 설명 · 운영 절차(런북)', '절(##) 단위로 색인']);
  s.node('mem', 40, 390, 290, 100, ['사건 Memory', '과거 조사의 요약만 저장', '비밀값·원문은 저장하지 않음']);
  s.node('assets', 40, 530, 290, 100, ['자산 정보', '서버 이름·IP·역할·중요도', '이름 또는 IP로 조회']);
  s.node('mcp', 400, 100, 300, 190, ['MCP 서버 (읽기 전용)', 'stdio · JSON-RPC 2.0', 'siem_search_alerts · siem_get_alert', 'xdr_classify · asset_lookup', '쓰기·삭제·실행 도구 없음', '응답 상한 50건 · 비밀값 가림'], { stroke: '#2f7fb0', sw: 2 });
  s.node('xdr', 400, 330, 300, 120, ['XDR 판정 (규칙 기반)', '무차별 대입 · 웹 공격 · 파일 변경', 'DB 권한 변경 · 유출 시그니처', 'block / alert / record + 확신도 + MITRE']);
  s.node('loop', 730, 100, 310, 190, ['Agent loop', '도구 선택 → 호출 → 관찰 반복', '실패 시 3회 재시도 · MCP 서버 재시작', '같은 호출 반복·허용 밖 요청은 거부', '3회 거부되면 조사 중단'], { fill: '#fff', stroke: '#2f7fb0', sw: 2.2 });
  s.node('model', 730, 330, 310, 120, ['판단 모델', 'Claude Messages API(tool_use)', '키 없이 쓰는 정해진 순서 계획기도 지원']);
  s.node('guard', 400, 490, 640, 150, ['통제 (모든 호출의 앞뒤)', '도구 허용 목록 · 로그 속 지시문 탐지(데이터로만 취급) · 데이터 경계 표시', '키·토큰·비밀번호는 응답·보고서·Memory에 쓰기 전에 가림', '시각을 믿을 수 없는 경보(시계 틀어짐)는 시각 기반 판단을 하지 않음', '도구 결과에 없는 사실은 만들지 않음'], { fill: '#fff', stroke: '#c0463f' });
  s.node('rep', 1110, 100, 270, 190, ['조사 보고서', '판정 · 확신도 · MITRE', '타임라인(같은 출발지의 경보)', '근거 문서(이름·판·절)', '도구 호출 기록']);
  s.node('unc', 1110, 330, 270, 120, ['불확실한 점', '누락 필드 · 도구 실패 · 문서 값 충돌', '시각 신뢰도 · 지시문 탐지']);
  s.node('ok', 1110, 490, 270, 150, ['사람의 승인', '차단·격리 같은 대응은', 'Agent가 실행하지 않고', '"승인 필요" 제안으로만 낸다'], { stroke: '#4b9a63', sw: 2.2 });
  s.link([[330, 150], [400, 150]], { arrow: 'none' });
  s.link([[330, 295], [365, 295], [365, 390], [400, 390]], { arrow: 'none' });
  s.link([s.p('mcp', 'r'), s.p('loop', 'l')], { arrow: 'both' });
  s.link([[550, 290], [550, 330]], { arrow: 'both', label: '판정' });
  s.link([s.p('loop', 'b'), s.p('model', 't')], { arrow: 'both' });
  s.link([[330, 295], [346, 295], [346, 76], [885, 76], [885, 100]], { arrow: 'none', dash: true, label: 'rag_search', lx: 520, ly: 76 });
  s.link([[330, 440], [358, 440], [358, 66], [960, 66], [960, 100]], { arrow: 'none', dash: true, label: 'memory_search', lx: 760, ly: 66 });
  s.link([s.p('loop', 'r', 0), s.p('rep', 'l')]);
  s.link([s.p('rep', 'b'), s.p('unc', 't')], { arrow: 'none' });
  s.link([s.p('unc', 'b'), s.p('ok', 't')]);
  s.text(24, 740, ['실제 경보 4건을 Claude 모델로 조사했고, 6유형(정상·공격·정보 부족·도구 실패·악의적 입력·Memory 재사용)은 자체 시험 코드로 반복 확인했다.'], { size: 13, fill: COLOR.muted });
  return s.toString('구역 7 · AI Agent 기반 보안 운영 지원');
}
