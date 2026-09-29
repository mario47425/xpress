# CommuteCircle — PRD Acceptance Test Validation (PRD Section 10)

| # | Scenario | Expected Result | Status | Notes |
|---|---|---|---|---|
| **1** | Passenger and rider sign up on two phones, pass verification steps | Both portals show progress; rider vehicle approved; role switcher works | ⏳ Pending | |
| **2** | Nightly job runs on seeded schedules | PB shows Ghost card with confidence; RD shows matching trip card | ⏳ Pending | |
| **3** | Passenger confirms, rider opens seats | Pod forms, both dashboards show pod and driver rotation | ⏳ Pending | |
| **4** | Passenger taps 'I'm waiting' at hotspot from within 100 m | SafeTrail starts; rider sees live count and detour; tapping farther away is blocked | ⏳ Pending | |
| **5** | Rider scans passenger QR, then tries screenshot of same QR | First scan accepted and ride Verified; second rejected as already used | ⏳ Pending | |
| **6** | Exact pickup point before both confirm | Not visible in either portal; visible only after both confirm and within 10 minutes of pickup | ⏳ Pending | |
| **7** | GPS simulator sends rider 400 m off route | Soft check-in fires; no reply in 60s sends contact link and starts SOS | ⏳ Pending | |
| **8** | SOS fires with moderator and normal user nearby | Contacts & support notified first; moderator alerted; after 60s normal user alerted; map lights up | ⏳ Pending | |
| **9** | Relay pass with two pool legs and a bus leg | Scan at pickup, handoff scan closes leg 1 and starts leg 2, both legs settle | ⏳ Pending | |
| **10**| Ride completed | Fare split with reason shown on both sides, rider sees cost recovery under cap, feedback updates trust & streak | ⏳ Pending | |
| **11**| Passenger requests women-only pod with Trusted minimum | Only matching riders appear | ⏳ Pending | |
| **12**| Moderator reviews a flagged ride | Anonymised case view; action appears in audit log; conflict-of-interest case blocked | ⏳ Pending | |
