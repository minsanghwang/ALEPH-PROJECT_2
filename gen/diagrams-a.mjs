import { Svg, COLOR } from './lib.mjs';

/* ---------- 00 전체 토폴로지 ---------- */
export function overview() {
  const s = new Svg(1760, 1040);
  // 구역 바탕
  s.zone(20, 56, 270, 960, '외부 · 지점', COLOR.ext);
  s.zone(310, 56, 250, 960, '경계', COLOR.edge);
  s.zone(580, 56, 330, 960, '보안 코어 (방화벽 · IPS)', COLOR.sec);
  s.zone(930, 56, 810, 420, '직원망 + 웹 보호 구간', COLOR.staff);
  s.zone(930, 496, 810, 270, '서버망 · 로그망', COLOR.srv);
  s.zone(930, 786, 810, 230, '관리망 (OOB) 10.14.200.0/24', COLOR.mgmt);

  // 외부
  s.node('net', 40, 96, 230, 52, ['인터넷', '실제 인터넷(GNS3 클라우드)']);
  s.node('isp', 40, 190, 230, 62, ['ISP 라우터', '192.0.2.1/29 · NAT 구간']);
  s.node('wanr', 40, 420, 230, 62, ['WAN 라우터', '지점 3곳을 잇는 가운데 망']);
  s.node('svc', 40, 540, 230, 70, ['서비스 DC', '203.0.113.0/29', '쇼핑몰 · 연동 API']);
  s.node('log', 40, 640, 230, 70, ['물류 DC', '203.0.113.8/29', '재고 시스템(WMS)']);
  s.node('ctr', 40, 740, 230, 62, ['물류센터', '203.0.113.24/29 (연결 구성 준비)'], { dash: true });
  // 경계
  s.node('edge', 330, 420, 210, 70, ['WAN-EDGE', '203.0.113.18/29 (본사 203.0.113.16/29)', 'NAT · IKE/ESP 정적 NAT']);
  s.node('tap', 330, 530, 210, 52, ['TAP 허브', '트래픽 복사']);
  s.node('ids', 330, 620, 210, 62, ['IDS (Suricata)', '패시브 탐지 · 10.14.200.14']);
  // 보안 코어
  s.node('fw', 610, 150, 270, 196, ['pfSense 방화벽 · VPN', 'em0 WAN 10.14.0.2/30', 'em1 Transit 10.14.0.33/29', 'em2 ISP 192.0.2.2/29 (NAT)', 'em3 서버 10.14.90.1 · 로그 10.14.210.1', 'em4 관리 10.14.200.1', 'IPsec IKEv2 · 기본 차단 규칙'], { fill: '#fff', stroke: '#c0463f', sw: 2.4 });
  s.node('ips', 610, 470, 270, 130, ['IPS (Suricata 인라인)', '쌍 A: pfSense e1 ↔ Transit_SW', '쌍 B: pfSense e3 ↔ LOG_SW', '사용자 정의 규칙 · EVE 로그'], { stroke: '#c0463f', sw: 2 });
  // 직원망
  s.node('tr', 950, 100, 150, 46, ['Transit_SW', '10.14.0.32/29']);
  s.node('waf', 1150, 96, 260, 52, ['WAF (nginx + ModSecurity)', '10.14.0.36 · TLS 종단 · 공격 403']);
  s.node('swg', 1150, 160, 260, 52, ['SWG (Squid 프록시)', '10.14.0.37:3128 · WPAD 자동 설정']);
  s.node('core', 950, 232, 210, 56, ['Core-SW1 / Core-SW2', 'L3 이중화 · WAF 보호 ACL']);
  s.node('dist', 950, 316, 210, 56, ['Dist-SW1 ~ 4', 'HSRP 이중화 · VLAN 게이트웨이']);
  s.node('acc', 950, 400, 210, 56, ['Access-SW1 ~ 5', '부서별 VLAN 접속']);
  s.node('pcs', 1200, 240, 520, 216, ['직원 PC (부서별 VLAN)', 'DEV 10.14.10.0/24 (VLAN 410)', 'ADM 10.14.20.0/24 (VLAN 420)', 'HRF 10.14.30.0/24 (VLAN 430)', 'SHOP 10.14.40.0/24 (VLAN 440)', 'CS 10.14.50.0/24 (VLAN 450)', 'VLAN당 이론상 251대, 5개 합계 1,255대까지 가능', '웹 접속은 SWG 경유, 업무 웹은 WAF 경유'], { stroke: '#4b9a63' });
  // 서버망
  s.node('logsw', 950, 540, 150, 46, ['LOG_SW', '로그 구역 10.14.210.0/24']);
  s.node('logsrv', 1130, 534, 250, 58, ['LogSRV (Wazuh SIEM)', '10.14.200.11 / 10.14.210.11']);
  s.node('srvagg', 950, 640, 150, 46, ['SRV-AGG', '서버 VLAN 490']);
  s.node('dhcp', 1130, 628, 120, 58, ['DHCP', '.10']);
  s.node('db', 1262, 628, 120, 58, ['IT-DB', '.11 MariaDB']);
  s.node('dns', 1394, 628, 120, 58, ['DNS-01', '.12 BIND']);
  s.node('cns', 1526, 628, 100, 58, ['CNS', '.13 캐시']);
  s.node('erp', 1636, 628, 90, 58, ['ERP-WEB', '.14']);
  s.text(1130, 716, '서버 구역 10.14.90.0/24 (게이트웨이는 pfSense, 서버 통신도 IPS를 거침)', { size: 12.5, fill: COLOR.muted });
  // 관리망
  s.node('mgsw', 950, 830, 170, 52, ['MGMT_SW1', '관리망 중심']);
  s.node('bk', 1150, 830, 170, 52, ['BackupSRV', '.15 관리 중계 · 백업']);
  s.node('adm', 1350, 830, 170, 52, ['관리 PC', '.101']);
  s.node('mgsub', 950, 920, 770, 70, ['MGMT_CORE → MGMT_WEB(WAF·SWG) / MGMT_SRV(DHCP·DNS·CNS·DB·ERP)', '모든 서버의 두 번째 NIC(.21~.27) · SSH는 BackupSRV와 관리 PC에서만 · 로그는 이 길로 LogSRV로 전달']);

  // 연결
  s.link([s.p('net', 'b'), s.p('isp', 't')], { arrow: 'none' });
  s.link([s.p('isp', 'r'), [610, 221]], { arrow: 'none', label: 'em2 (ISP)', lx: 590, ly: 221 });
  s.link([s.p('wanr', 'r'), s.p('edge', 'l')], { arrow: 'none', label: 'IPsec 터널 통과', lx: 300, ly: 451 });
  s.link([[40, 451], [28, 451], [28, 771], [40, 771]], { arrow: 'none' });
  s.link([[28, 575], [40, 575]], { arrow: 'none' });
  s.link([[28, 675], [40, 675]], { arrow: 'none' });
  s.link([s.p('edge', 'b'), s.p('tap', 't')], { arrow: 'none' });
  s.link([s.p('tap', 'b'), s.p('ids', 't')], { arrow: 'none', dash: true, label: '복사' });
  s.link([s.p('tap', 'r'), [575, 556], [575, 330], [610, 330]], { arrow: 'none', label: 'em0 (WAN)', lx: 575, ly: 470 });
  s.link([[745, 346], [745, 470]], { arrow: 'none', label: 'e1 · e3', lx: 745, ly: 408 });
  s.link([[880, 500], [920, 500], [920, 123], [950, 123]], { arrow: 'none', label: '쌍 A', lx: 920, ly: 300 });
  s.link([[880, 563], [950, 563]], { arrow: 'none', label: '쌍 B', lx: 915, ly: 563 });
  s.link([[1100, 123], [1125, 123], [1125, 186], [1150, 186]], { arrow: 'none' });
  s.link([[1125, 122], [1150, 122]], { arrow: 'none' });
  s.link([s.p('tr', 'b'), s.p('core', 't')], { arrow: 'none' });
  s.link([s.p('core', 'b'), s.p('dist', 't')], { arrow: 'none' });
  s.link([s.p('dist', 'b'), s.p('acc', 't')], { arrow: 'none' });
  s.link([s.p('acc', 'r'), [1180, 428], [1180, 348], [1200, 348]], { arrow: 'none' });
  s.link([s.p('logsw', 'r'), s.p('logsrv', 'l')], { arrow: 'none' });
  s.link([s.p('logsw', 'b'), s.p('srvagg', 't')], { arrow: 'none' });
  s.link([[1100, 663], [1112, 663], [1112, 618], [1686, 618]], { arrow: 'none' });
  for (const x of [1190, 1322, 1454, 1576, 1681]) s.link([[x, 618], [x, 628]], { arrow: 'none' });
  s.link([[880, 168], [900, 168], [900, 856], [950, 856]], { arrow: 'none', dash: true, color: '#8c6fcf', label: 'em4 관리', lx: 900, ly: 700 });
  s.link([s.p('mgsw', 'r'), s.p('bk', 'l')], { arrow: 'none' });
  s.link([s.p('bk', 'r'), s.p('adm', 'l')], { arrow: 'none' });
  s.link([[1035, 882], [1035, 920]], { arrow: 'none' });
  s.text(48, 850, ['IPsec VPN: 서비스 DC · 물류 DC와', '사이트 간 터널 (pfSense가 종단)'], { size: 12, fill: '#a8423c' });
  s.legend(1396, 14);
  s.text(30, 1034, '※ 지점·외부 공인 대역 주소는 문서용 대역(TEST-NET)으로 바꿔 표기했다. 내부 주소(10.x)는 실제 값이다.', { size: 12, fill: COLOR.muted });
  return s.toString('BaliExpress 본사(HQ) 전체 토폴로지');
}

/* ---------- 01 외부 · 경계 · VPN ---------- */
export function edgeVpn() {
  const s = new Svg(1240, 700);
  s.zone(20, 56, 360, 620, '인터넷 쪽', COLOR.ext);
  s.zone(400, 56, 430, 620, '본사 경계', COLOR.edge);
  s.zone(850, 56, 370, 620, '지점 (VPN 상대)', COLOR.ext);
  s.node('net', 50, 96, 300, 54, ['인터넷', 'GNS3 클라우드 → 호스트 PC 회선']);
  s.node('isp', 50, 200, 300, 70, ['ISP 라우터 (c3745)', 'Fa0/0 192.0.2.1/29', '인터넷 방향 NAT·기본 경로']);
  s.node('ntp', 50, 330, 300, 90, ['시간 동기', 'pfSense가 kr.pool.ntp.org, time.google.com', 'time.cloudflare.com 에 동기', '모든 서버는 pfSense를 기준으로 동기']);
  s.node('nat', 50, 450, 300, 100, ['아웃바운드 NAT (hybrid)', '10.14.0.0/16 → em2 로 나갈 때', '192.0.2.2 로 주소 변환', '지점 방향은 WAN 경로로 고정']);
  s.node('fw', 430, 200, 370, 200, ['pfSense 방화벽 · VPN 종단', 'em0 WAN 10.14.0.2/30 (지점·VPN 방향)', 'em2 ISP 192.0.2.2/29 (인터넷 방향)', 'IPsec IKEv2: con1(서비스 DC), con2(물류 DC)', '교섭: AES-256 · SHA-256 · DH14 · NAT-T · DPD', '자식 SA: ESP AES-GCM-256', '인터페이스별 규칙 + IPsec 탭 규칙 (기본 차단)'], { fill: '#fff', stroke: '#c0463f', sw: 2.4 });
  s.node('edge', 430, 450, 370, 76, ['WAN-EDGE (본사 경계 라우터)', 'Fa0/0 203.0.113.18/29 · Fa0/1 10.14.0.1/30', 'IKE(UDP 500/4500)·ESP를 pfSense로 정적 NAT']);
  s.node('tap', 430, 560, 170, 56, ['TAP 허브', 'WAN 쪽 트래픽 복사']);
  s.node('ids', 630, 560, 170, 56, ['IDS (Suricata)', '패시브 탐지']);
  s.node('wanr', 880, 450, 310, 76, ['WAN 라우터', '3개 지점과 본사를 잇는 가운데 망', 'UDP 터널로 지점 클라우드에 연결']);
  s.node('svc', 880, 96, 310, 112, ['서비스 DC', '203.0.113.0/29 · 쇼핑몰 + 연동 API', 'VPN 상대 203.0.113.4 (CARP)', '본사 쪽 허용: ERP-WEB → API 3000, 웹 80', '직원 웹 경유: SWG 10.14.0.37 → 쇼핑몰 80']);
  s.node('log', 880, 238, 310, 112, ['물류 DC', '203.0.113.8/29 · 재고(WMS) HTTP API', 'VPN 상대 203.0.113.12 (CARP)', '본사 쪽 허용: ERP-WEB → WMS 80, ICMP']);
  s.node('ctr', 880, 380, 310, 52, ['물류센터 203.0.113.24/29', 'VPN 설정 준비(비활성)'], { dash: true });
  s.link([s.p('net', 'b'), s.p('isp', 't')], { arrow: 'none' });
  s.link([s.p('isp', 'r'), [430, 235]], { arrow: 'none', label: 'em2', lx: 392, ly: 235 });
  s.link([[515, 400], [515, 450]], { arrow: 'none', label: 'em0', lx: 515, ly: 425 });
  s.link([[515, 526], [515, 560]], { arrow: 'none' });
  s.link([s.p('tap', 'r'), s.p('ids', 'l')], { arrow: 'none', dash: true });
  s.link([s.p('edge', 'r'), s.p('wanr', 'l')], { arrow: 'none' });
  s.link([[1190, 488], [1205, 488], [1205, 152], [1190, 152]], { arrow: 'none' });
  s.link([[1205, 294], [1190, 294]], { arrow: 'none' });
  s.link([[1205, 406], [1190, 406]], { arrow: 'none' });
  s.link([[800, 260], [840, 260], [840, 152], [880, 152]], { arrow: 'none', dash: true, color: '#c0463f', w: 2.4, label: 'con1', lx: 840, ly: 206 });
  s.link([[800, 340], [845, 340], [845, 294], [880, 294]], { arrow: 'none', dash: true, color: '#c0463f', w: 2.4, label: 'con2', lx: 845, ly: 318 });
  s.legend(890, 580);
  s.text(30, 690, '※ 공인 대역 주소는 문서용 대역으로 바꿔 표기했다.', { size: 12, fill: COLOR.muted });
  return s.toString('구역 1 · 외부와 경계: 인터넷, 지점 연결, VPN');
}
