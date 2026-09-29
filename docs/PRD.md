CommuteCircle

Product Requirements Document (PRD)

Predictive, trust-ranked, community-moderated peer-to-peer ride sharing

Item

Detail

Product

CommuteCircle (working title) - Peer Booking Portal + Rider Portal

Source

CommuteCircle Idea Document (Uproot Innovation, Problem Statement 2: Urban Commute & Mobility Crisis)

Version / date

1.0 - 29 September 2026

Status

Build-ready draft for the prototype; every feature listed is to be functional, not mocked

Portals

1) Peer Booking Portal (passenger side, includes the Relay Mode QR)   2) Rider Portal (vehicle-owner side, includes the QR scanner)



Reading guide: PB = Peer Booking Portal, RD = Rider Portal, Both = built in both portals. Priority P0 = must work in the demo build, P1 = build if time allows after all P0 items pass.

1. Product Overview

1.1 Problem

Urban commuters and students face rising travel costs, congestion, overcrowded public transport, safety barriers (especially for women) and pollution, while millions of private vehicles run with empty seats every day.

1.2 Solution

CommuteCircle is a peer-to-peer ride-sharing community. People already making a trip share the ride and split only the fuel and toll cost. It is not a taxi service: riders (vehicle owners) are ordinary commuters and no one earns a fare or profit. Three things are automatic: prediction (rides form before anyone asks), trust (a visible earned ranking) and safety (a community that watches over its own members).

One-line pitch: We predict tomorrow's commute, form trusted recurring pods automatically, protect privacy and safety in real time, and let the community's most trusted members keep everyone safe.

1.2.1 Terminology used in this PRD

Term

Meaning

Passenger / user

Person who books a seat. Uses the Peer Booking Portal (the 'user app').

Rider

Person who owns a vehicle and offers seats on a trip they are already making. Uses the Rider Portal. (The idea document calls this person the 'driver'.)

Pod

Fixed group of 3 to 4 commuters with overlapping weekday routes, rotating the driver role.

Hotspot

Fixed, safe pickup point on a common route.

Journey Pass

Signed QR pass that holds all legs of a Relay Mode journey.

Moderator

Community Anchor (top tier) member who reviews cases and responds first to SOS alerts.

1.3 Goals and non-goals

Goals: a working two-portal product covering all nine idea-document features; a closed loop from prediction to booking, pickup handshake, tracked ride, settlement and trust update; a demo that runs live on two phones.

Non-goals (this build): real bus ticketing, real payment rails, on-device federated matching, Carbon Commute Credits, Shapley-based fares, native power-button SOS, and a full admin back-office. These stay on the roadmap.

1.4 Success metrics (demo and pilot)

Metric

Target

Prediction-to-confirm rate on Ghost Commute cards

At least 50% of proposals confirmed in the pilot corridor

Pickup handshake success (QR or code)

At least 95% of pickups verified in under 10 seconds

Time from SOS trigger to contacts and support notified

Under 3 seconds

Time from SOS trigger to first nearby responder alerted

Under 5 seconds for Tier 1; Tier 2 fires at 60 seconds if unacknowledged

Rides with structured feedback submitted

At least 80%

Stranded riders (no ride and no fallback offered)

0

2. Portals, Roles and Feature Parity

Both portals are part of one product and one codebase. A person has one account and may hold both roles, switching with a role switcher. Every feature that concerns both sides of a ride is built in both portals, each showing the view relevant to that role.

2.1 Feature parity matrix

Feature

Peer Booking Portal (PB)

Rider Portal (RD)

Sign-up, OTP, verification ladder, profile

Yes

Yes (+ vehicle and licence)

Fuzzy Home / privacy reveal ladder

Yes

Yes

Ghost Commutes

Confirm / skip tomorrow's proposed ride

Open seats / skip tomorrow's proposed trip, demand nudges

Recurring Pods

Pod dashboard, driver schedule, standby

Pod dashboard, own driving days, standby handling

Pickup Hotspots

'I'm waiting', wait estimate, confidence

Hotspots on route, live waiting counts, detour estimate

Pickup handshake

Shows QR and short code

Scanner and manual code entry

Relay Mode

Planner (3 options) and Journey Pass QR

Scanner for pass, pool-leg itinerary, handoff screen

SafeTrail (tracking, deviation alerts, share link)

Yes

Yes

Silent SOS and trusted contacts

Yes

Yes

Women-only pods and match filters

Yes

Yes

Trust ranking, badges, streaks, vouching, leaderboards

Yes

Yes

Moderator tools (Community Anchors)

Yes, role-gated

Yes, role-gated

SOS responder mode

Yes

Yes

Fair-Fare Engine and wallet

Pays fare share, sees reason

Sees cost recovery (never earnings), cap check

Ride lifecycle, cancellation, history, feedback

Yes

Yes

Notifications

Yes

Yes



Support team: SOS alerts and unanswered check-ins also go to the platform support team. In this build that is delivered through a simulated SMS/email log and a small read-only ops page. It is a utility screen, not a third dashboard.

3. Functional Requirements

All requirements below must be backed by real logic, a real database and real-time channels. Where an external service is not available in the prototype (SMS, payments, ID verification, bus ticketing), a sandbox adapter with the same interface is used so the flow still works end to end (see section 8).

3.1 Accounts, verification and profile

ID

Requirement

Portal

Pri

A1

Phone OTP sign-up and login. In sandbox mode the OTP appears in an in-app dev inbox.

Both

P0

A2

One account, two roles. The user picks Passenger, Rider or both; a header role switcher moves between the two portals without re-login.

Both

P0

A3

Verification ladder: phone OTP, college or employer ID (domain email or ID photo), government ID upload, selfie match at ride start. Each completed step raises the verification score and is shown as a progress bar.

Both

P0

A4

Vehicle setup: type, plate, seats offered, fuel type, mileage (km/l), licence upload. A vehicle must be approved (sandbox auto-approve or moderator approval) before the rider can offer rides.

RD

P0

A5

Profile: photo, gender preference, 1 to 5 trusted contacts, safety preferences (safe route for late trips, minimum trust tier, women-only).

Both

P0

A6

Weekly schedule entry once (class timetable or shift hours, home zone, destination) with optional .ics calendar import.

Both

P0

3.2 Fuzzy Home and privacy

ID

Requirement

Portal

Pri

B1

Home and work are stored only as low-precision geohash cells (precision 6). Exact home or work coordinates are never persisted.

Both

P0

B2

Reveal ladder enforced on the server: a stranger sees a blurred zone; a matched partner sees a corridor; the exact pickup point is released only after both parties confirm and only within 10 minutes of pickup.

Both

P0

B3

'What others can see about me' screen showing the current reveal level per relationship.

Both

P1

B4

Moderators see only anonymised case data, never trip histories or home locations.

Both

P0

3.3 Ghost Commutes (prediction)

ID

Requirement

Portal

Pri

C1

Nightly job (and on schedule change) builds tomorrow's predicted trips from schedule, habit frequency counts, weather, holidays and exam dates, then clusters by route and time.

Both

P0

C2

Every proposal carries a confidence score (0 to 100) shown to the user. Proposals below 60 are not pushed; they appear only in a 'maybe' list.

Both

P0

C3

PB card: 'Tomorrow 08:10, Peelamedu to campus, 3 riders, Rs 28. Confirm?' with Confirm, Skip and Change time. RD card: 'Tomorrow 08:10, you can carry 3, your cost share Rs X' with Open seats and Skip.

PB / RD

P0

C4

Demand forecast: when expected riders exceed seats on a corridor, RD gets a one-tap 'Open extra seat' nudge and PB shows a 'High demand' badge.

Both

P1

C5

Proposals and pod routes drawn on the map (Leaflet polylines).

Both

P0

C6

Confirm and Skip actions are stored as feedback that adjusts future confidence.

Both

P0

3.4 Recurring Pods

ID

Requirement

Portal

Pri

D1

Automatic pod proposal: 3 to 4 members, at least 70% corridor overlap, departure within 10 minutes, at least 3 shared weekdays. Members accept to form the pod.

Both

P0

D2

Driver rotation by day or week; the pod schedule shows who drives each day. Costs are balanced across the rotation.

Both

P0

D3

Standby pool: if a member cancels, a verified standby substitute is notified, accepts, and joins for that day.

Both

P0

D4

Pod dashboard: money saved, CO2 saved (configurable factor per passenger-km), streak count and shared pod reputation.

Both

P0

D5

Pod ledger showing rotation balance per member.

Both

P1

3.5 Pickup Hotspots

ID

Requirement

Portal

Pri

E1

Hotspot map with type (bus stop, petrol pump, college gate, junction) and safety attributes (lit, legal stopping).

Both

P0

E2

Hotspots are proposed automatically where at least 5 routes overlap and stopping is safe; moderators and admins approve, nominate or report them.

Both

P0

E3

'I'm waiting' button, enabled only within 100 m of the hotspot. Tapping it starts SafeTrail tracking and opens a match request to passing riders.

PB

P0

E4

Rider view: hotspots along the active route with live counts and detour estimate ('2 riders waiting, +1 min'). The rider can accept or skip each pickup.

RD

P0

E5

Passenger sees estimated wait and a ride-confidence indicator from historical pickups at that place and time.

PB

P0

E6

Fallback: if no pool ride arrives within 10 minutes (configurable), the app offers a Relay bus leg or another alternative.

PB

P0

E7

Pickup handshake: rider scans the passenger's QR or types the 6-character short code (see section 4).

Both

P0

E8

Rules: maximum detour cap (default 3 minutes or 1.5 km), no-show reduces the reliability score.

Both

P0

3.6 Relay Mode with QR

Detailed flow, token design and scanner behaviour are in section 4.

ID

Requirement

Portal

Pri

F1

Planner: origin, destination and time produce three options (cheapest, fastest, safest) from a graph search over pool, bus, walk and shared-cycle legs weighted by cost and time.

PB

P0

F2

Route data: hand-built table of real bus routes for the pilot corridor (stops, coordinates, timings, fares) plus OpenStreetMap walking paths. Routes can be edited by CSV or JSON import.

Both

P0

F3

Selecting an option issues a Journey Pass: a signed JWT rendered as a QR code inside the passenger app.

PB

P0

F4

Pass screen lists the legs, highlights the current leg, refreshes the QR every 30 seconds and shows a short-code fallback.

PB

P0

F5

Rider Portal scanner verifies the pass and shows passenger photo, name, trust tier, current leg and pickup point with Accept and Reject.

RD

P0

F6

Handoffs between pool legs: the incoming rider scans the pass, the outgoing leg closes and its fare settles.

RD

P0

F7

Bus legs: passenger marks boarded and alighted with geofence assist. Fares are paid on the bus, no ticketing in this build.

PB

P1

F8

Rider sees 'Leg 1 of 3 - drop at handoff X' for relay journeys where they carry a pool leg.

RD

P0

F9

One wallet handles all pool legs of a journey (mock UPI-style flow).

Both

P0

3.7 SafeTrail

ID

Requirement

Portal

Pri

G1

Live tracking starts at 'I'm waiting', continues through the ride to drop, and reports position every 5 seconds from both passenger and rider devices.

Both

P0

G2

Expected corridor and ETA are known. A route deviation over 300 m for 60 seconds, an unexpected stop over 3 minutes, or no location update for 90 seconds triggers a soft check-in: 'Are you okay?'.

Both

P0

G3

No reply within 60 seconds sends trusted contacts a live-link page (no login needed, expires one hour after trip end) and starts the SOS flow.

Both

P0

G4

One-tap share of the live trip link with family or friends at any time.

Both

P0

G5

Silent SOS through a hidden trigger: hold the shield for 3 seconds, or a triple-tap pattern, or a phone shake. A native power-button trigger is roadmap (see section 9).

Both

P0

G6

Safe-route preference: for trips after 20:00 the router prefers busier, lit roads (OSM highway class and lit tags) and shows a route safety rating.

Both

P0

G7

Women-only pods and match filters by gender preference and minimum trust tier.

Both

P0

G8

Ride-start verification: selfie match against the profile photo plus a mutual check card (photo, name, vehicle plate, ride code).

Both

P0

G9

After each ride: structured feedback (on time, comfortable driving, route matched, felt safe) and an optional flag or report.

Both

P0

G10

Driving smoothness captured from phone motion sensors during the ride and fed into the safety score.

RD

P1

3.8 Gamified Trust Ranking

ID

Requirement

Portal

Pri

H1

Trust score (0 to 100) with a breakdown screen explaining every input. Weights in section 6.3.

Both

P0

H2

Tiers enforced server-side: Newcomer, Trusted, Verified Guardian, Community Anchor, each unlocking the features listed in section 6.3.

Both

P0

H3

Clean-ride streaks and behaviour badges (Always on time, Safe driver, Pod founder).

Both

P0

H4

Vouching: a Trusted member vouches for a newcomer and shares a small trust penalty if the newcomer misbehaves.

Both

P1

H5

Leaderboards by pod, campus or department, and clean-ride streak.

Both

P1

H6

Trust score and tier are shown at match time and confirmation, on both the passenger and the rider side.

Both

P0

H7

Anti-gaming: ratings weighted by the rater's own trust, reciprocal-rating ring detection, and a capped ride-count component.

Both

P0

H8

Users can view what changed their score and dispute a rating or flag.

Both

P1

3.9 Community Moderators and SOS Network

ID

Requirement

Portal

Pri

I1

Moderator eligibility: Community Anchor tier, full verification, clean record, minimum active period. An admin confirms each appointment (sandbox: seeded approval action).

Both

P0

I2

Moderator queue: flagged rides, disputes, hotspot reviews, newcomer vouching. Every action is written to an immutable audit log. Moderators cannot handle cases involving their own pod.

Both

P0

I3

Case view shows anonymised, limited data only.

Both

P0

I4

Community rating of moderators and demotion when the rating or conduct falls below threshold.

Both

P1

I5

SOS flow: contacts and support notified first; Tier 1 alerts nearby moderators within 2 km (tunable); if no acknowledgement in 60 seconds, Tier 2 widens to any verified online user near the location.

Both

P0

I6

Responder alert shows location, distance, ETA and a short message only, with a prompt to call 112 first and a 'do not confront' notice. Buttons: Acknowledge and Can't help. Responding is always optional.

Both

P0

I7

Responder availability toggle. Alerts are delivered only while the app is open and location sharing is on.

Both

P0

I8

Incident log per SOS. Verified helpers earn trust points and credits. False or abusive SOS lowers the sender's trust score; misuse of alert data removes the responder.

Both

P0

I9

Live SOS map: the alert location pulses and responders light up as they are notified and acknowledge.

Both

P0

3.10 Fair-Fare Engine and wallet

ID

Requirement

Portal

Pri

J1

Fare calculation per section 6.2 with a plain-language reason ('Your fare is Rs 22 because you added 0.8 km').

Both

P0

J2

Wallet with mock UPI-style top-up, pay and refund, backed by a double-entry ledger.

Both

P0

J3

Rider sees cost recovery (fuel and toll share collected against actual cost), never an earnings figure. Total collected can never exceed the actual trip cost.

RD

P0

J4

Settlement after ride completion. Platform fee default 5%, reduced by tier and waived for institutional plans (configurable).

Both

P0

J5

Pod balancing: rotation differences are netted weekly on the pod ledger.

Both

P1

3.11 Booking and ride lifecycle

ID

Requirement

Portal

Pri

K1

Passenger requests a ride: fuzzy origin zone, destination, time window, filters (women-only, minimum tier).

PB

P0

K2

Rider offers a trip: route, departure time, seats, vehicle, one-off or recurring; can edit or cancel.

RD

P0

K3

Matching scores corridor overlap, time difference, detour, trust and preferences; hotspot matching runs live for 'I'm waiting'.

Both

P0

K4

Two-way confirmation: rider accepts, passenger confirms. Confirmation by both unlocks the exact-point reveal.

Both

P0

K5

Status machine: Proposed, Confirmed, Waiting, Verified (handshake done), In transit, Completed, Cancelled, No-show, SOS.

Both

P0

K6

Cancellation with reason; late cancellations and no-shows reduce reliability; pod cancellations trigger the standby flow.

Both

P0

K7

Ride history and receipts.

Both

P1

K8

Notifications for every state change, proposal, SOS event and standby request via web push, in-app realtime and the simulated SMS log.

Both

P0

4. Relay Mode QR (Passenger App) and Scanner (Rider Portal)

4.1 What lives where

Portal

Component

Behaviour

Peer Booking

Relay planner

Shows cheapest, fastest and safest journeys as leg cards (pool, bus, walk, cycle) with cost, time and safety rating.

Peer Booking

Journey Pass screen

Full-screen QR generated from a server-signed token. Shows the leg list, current leg, passenger name, and a 6-character short code. QR auto-refreshes every 30 seconds. Screen stays awake during pickup.

Rider

Scanner screen

Camera scanner (html5-qrcode with BarcodeDetector where available) plus manual code entry. Requires HTTPS. Shows a result card in under 1 second.

Rider

Handoff screen

For relay legs: lists passengers to receive and drop at each handoff point and the next rider's details.

4.2 Journey Pass token

The QR encodes a compact JWT signed on the server (ES256 with a server-held private key; the client and the rider device never hold the key). The scanner sends the scanned string to the server, which verifies it. The rider device does not verify tokens on its own.

Claim

Content

sub

Passenger user ID

pid

Journey Pass ID

legs

Ordered leg list: leg number, mode (pool, bus, walk, cycle), start point ID, end point ID, planned time, assigned ride ID for pool legs

cur

Current leg index at time of issue

nonce

Random single-use value, unique per QR refresh

iat / exp

Issued-at and expiry, 60 seconds apart (QR refreshes every 30 seconds so a valid one is always on screen)

sc

Short code, 6 characters, mapped server-side to the same pass and leg

4.3 Scan flow

Step

Actor

Action and system response

1

Passenger

Confirms a Relay option. Server creates the pass and legs and issues the first token. QR appears in the app.

2

Passenger

Reaches the pickup hotspot and taps 'I'm waiting'. Tracking starts.

3

Rider

Approaches the hotspot, opens Scanner, scans the QR (or types the short code).

4

Server

Verifies signature, expiry and nonce (not used before); checks the scanning rider is the one assigned to the current leg; checks pass status is active and passenger is within 200 m of the rider.

5

Rider

Sees passenger photo, name, trust tier, leg and pickup point. Taps Accept.

6

Server

Marks the leg 'onboard', burns the nonce, moves the ride status to Verified, unlocks exact-point reveal and starts the in-ride SafeTrail. Both apps update instantly.

7

Handoff

At a handoff point the next assigned rider scans the same pass. The previous pool leg closes and settles; the next leg activates.

8

Passenger

Bus and walk legs advance with geofence-assisted check-ins. Last leg complete closes the pass and triggers feedback.

4.4 Scan result states

Result

Rider sees

Cause

Valid

Green card with passenger details and Accept

All checks passed

Expired

Amber: 'Ask passenger to refresh the QR'

Token older than 60 seconds

Already used

Red: 'This code was already scanned'

Nonce reused (screenshot replay)

Wrong rider / wrong leg

Red: 'Not assigned to this ride'

Scanner user is not the assigned rider for the current leg

Too far

Amber: 'Passenger is not at the pickup point'

Co-presence check failed

Cancelled or completed

Grey: 'Pass is no longer active'

Pass status

Invalid

Red: 'Not a CommuteCircle pass'

Signature failure or malformed data

4.5 Acceptance criteria

A valid pass scanned by the assigned rider returns a result card in under 1 second on a normal mobile connection.

A screenshot of a previously scanned QR is rejected as 'Already used'.

A QR older than 60 seconds is rejected as 'Expired'.

Manual short-code entry produces the same result as scanning and follows the same checks.

A scan by a rider not assigned to the leg never reveals passenger details.

A two-leg pass (pool, then pool at a handoff) passes through both scans and settles each leg separately.

Every scan, accepted or rejected, is written to the pass scan log.

5. Screens

5.1 Peer Booking Portal

Screen

Purpose

Onboarding and verification

OTP, schedule, gender and safety preferences, trusted contacts, ID and selfie steps

Home

Tomorrow's Ghost Commute card with confidence, active ride banner, quick SOS shield

Map

Pods, proposals, hotspots, safe-route overlay, live SOS view when responding

Find / request ride

Request form with filters and ranked matches showing trust tier and fare reason

Ride confirmation

Rider trust breakdown, fare split explanation, reveal-ladder status

Hotspot waiting

'I'm waiting' state, wait estimate, confidence, fallback timer, share link, SOS

Live ride

SafeTrail map, rider and vehicle card, ride code, deviation check-in prompts

Relay planner

Cheapest, fastest and safest options as leg timelines

Journey Pass (QR)

Dynamic QR, leg list, current leg, short code

Pods

Pod dashboard, driver schedule, standby pool, savings, streak

Trust profile

Score breakdown, tier progress, badges, vouches, leaderboards, disputes

Wallet and history

Balance, top-up, ledger, ride receipts

Safety centre

Contacts, preferences, privacy view, SOS test mode

Responder mode

Availability toggle, alert screen, acknowledge flow

Moderator queue

Role-gated case queue, hotspot reviews, vouching

5.2 Rider Portal

Screen

Purpose

Onboarding, vehicle and licence

Same verification ladder plus vehicle and licence approval

Home

Tomorrow's trip card with confidence and seats, next pickups, quick SOS shield

Offer a ride

One-off or recurring trip with route, time, seats and preferences

Route and hotspots

Active route with hotspots, live waiting counts and detour estimate

Requests inbox

Incoming matches with passenger trust tier and fare share; accept or decline

Scanner

Camera scan and manual code entry for pickup and handoff

Active drive

Ordered pickup and drop list, passenger cards, SafeTrail, SOS

Handoff

Relay legs to receive or hand to the next rider

Pods

Pod dashboard, own driving days, standby requests

Trust profile

Same as passenger side, plus driving smoothness component

Cost recovery and wallet

Cost share collected versus actual cost, fee, ledger

History

Past drives with feedback received

Safety centre

Contacts, preferences, privacy view, SOS test mode

Responder mode

Availability toggle, alert screen, acknowledge flow

Moderator queue

Role-gated case queue, hotspot reviews, vouching

6. Rules and Algorithms (defaults, all tunable)

6.1 Ghost Commutes and matching

Habit table: counts per user, weekday, 15-minute time bucket, origin cell and destination cell. Base confidence = weeks observed with the trip divided by weeks of history, adjusted by weather, holiday and exam flags.

Clustering: users with the same destination cell, origin corridor overlap of at least 70% and departure within 10 minutes form a candidate group (density-based clustering on corridor and time).

Match score = weighted sum of corridor overlap, time gap, detour cost, trust tier fit and preference fit. Riders and passengers below the requested minimum tier are filtered out.

Newcomer fairness: newcomer riders are guaranteed a share of matches so cold start does not lock them out.

6.2 Fair-Fare formula

Trip cost C = (fuel rate x distance / mileage) + toll, where fuel rate and mileage come from the rider's vehicle setup. Each occupant i (the rider included) gets a weight w_i = shared_km_i + detour_km_i, and the fare share is fare_i = C x w_i / sum of all w. The sum of all rider-side collected amounts is capped at C, and the reason text names the detour distance. The platform fee is charged separately and never added to the cost share. Shapley-based marginal cost is roadmap.

6.3 Trust score and tiers

Input

Weight

Notes

Safety behaviour

35%

Smooth driving, no deviations, no verified complaints or SOS incidents

Reliability

25%

Punctuality, cancellations, showing up when confirmed

Peer feedback

15%

Structured feedback weighted by the rater's trust

Verification level

10%

Steps completed on the ladder

Consistency

10%

Time active and pod participation

Ride count

5%

Capped so volume cannot dominate



Tier

Requirement (defaults)

Unlocks

Newcomer

Phone OTP and basic verification

Limited pods, standard matching

Trusted

About 15 clean rides, ID verified, score 60 or more

Recurring pods, women-only pods, vouching

Verified Guardian

Long clean streak (50 rides, 90 days), score 80 or more, full verification

Priority matching, lower commission, SOS responder Tier 1 role

Community Anchor

Score 90 or more, 180 days active, 100 clean rides, community contribution, admin approval

Moderator role, partner perks

6.4 SOS and SafeTrail timings

Parameter

Default

Location update interval

5 seconds

Deviation trigger

More than 300 m off corridor for 60 seconds

Unexpected stop

More than 3 minutes

Signal loss trigger

No update for 90 seconds

Check-in reply window

60 seconds

Tier 1 responder radius

2 km (tunable)

Tier 2 escalation

After 60 seconds without acknowledgement

Trusted-contact link expiry

1 hour after trip end

Hotspot fallback wait

10 minutes

Detour cap

3 minutes or 1.5 km

7. Data Model (core entities)

Entity

Key fields

users, profiles, roles

phone, name, photo, gender pref, role flags, verification score, tier, trust score

vehicles

owner, type, plate, seats, fuel type, mileage, approval status

verifications

user, step, status, document path (private storage)

trusted_contacts

user, name, phone

schedules, habit_counts

user, weekday, time bucket, origin cell, destination cell, count

ghost_predictions

user, date, route, time, confidence, status

pods, pod_members, pod_rotations

members, corridor, weekdays, driver per day, standby flag

hotspots, hotspot_waits

location, type, safety flags, status; waiting user, time, status

ride_offers, ride_requests

rider or passenger, corridor, time window, seats, filters, recurrence

rides, ride_participants

status, timestamps, exact pickup point (reveal-gated), fare, ride code

journey_passes, pass_legs, pass_scans

passenger, status; leg order, mode, assigned ride; scanner, result, time

bus_routes, bus_stops, bus_stop_times

route, stop coordinates, timings, fares

location_pings

user, ride, position, speed, time

safety_events

ride, type (deviation, stop, signal loss), check-in outcome

sos_alerts, sos_responses

sender, location, tier, ack time; responder, distance, ETA, action

trust_events, ratings, badges, vouches

event type, delta, weight; rater, target, structured answers

moderator_actions

moderator, case, action, time (append-only audit log)

wallets, ledger_entries

user balance; double-entry rows for top-up, fare, refund, fee

notifications, sms_log

channel, payload, delivery status (sandbox log)

8. Architecture and Technology

Layer

Choice

Front end

React PWA (Vite) with two route trees, /app (Peer Booking) and /rider (Rider), sharing one component and API library

Backend and data

Supabase: Postgres with PostGIS, Auth, Realtime, Storage, Edge Functions, row-level security for every reveal and role rule

Intelligence service

Node or Python worker: prediction, clustering, matching, fare, trust scoring and SOS escalation timers, run on a schedule and on events

Maps and routing

OpenStreetMap with Leaflet; OSRM public server or a small routing library; graph search for Relay planner

Realtime

Supabase Realtime (WebSockets) for pings, alerts and status; web push for offline notifications

QR

qrcode for generation; html5-qrcode for scanning; server-signed JWT

Privacy

Geohash truncation and reveal-on-confirm enforced in database policies, not the client

8.1 Sandbox adapters (so every feature is workable without paid services)

Capability

Prototype implementation

Production swap

SMS and OTP

In-app dev inbox and sms_log with the same interface

SMS gateway

Payments

Wallet with real ledger and mock UPI-style flow

UPI or payment gateway

ID verification

Upload plus sandbox approve; selfie compared on-device with face-api.js

KYC vendor

Bus data

Seeded table for the pilot corridor

Official transit feed

Support team

Ops page and simulated message log

Support tooling

Demo GPS

A GPS simulator that replays a route so deviations can be shown on stage

Not used

8.2 Non-functional requirements

Security: signing keys and ID documents never leave the server or private storage; JWT verification only server-side; row-level security on every table; audit log append-only.

Privacy: no exact home or work coordinates persisted; reveal ladder enforced by policy; moderators see anonymised data only.

Performance: scan result under 1 second, SOS to contacts under 3 seconds, map updates within 5 seconds.

Reliability: pings queue locally and flush when the connection returns; the last issued QR stays valid until its own expiry if the passenger goes offline.

Accessibility and mobile: mobile-first layouts, large touch targets for SOS and scanner, high contrast, English first with room for Tamil and Hindi strings.

Legal framing: riders share only fuel and toll cost of a trip they were making anyway, fares are capped at that cost share, and rules for paid rides in private vehicles must be checked against current motor vehicle regulations before launch claims are made.

9. Constraints and Known Limits

Power-button SOS: a web app cannot read hardware power-button presses. The PWA uses a hold-to-trigger shield, triple-tap pattern and shake. A true power-button trigger needs the native (Flutter) app, on the roadmap.

Background tracking: browsers stop location updates when the screen locks. The app uses the Screen Wake Lock API and prompts the user to keep it open during a ride. Native app removes this limit.

Push on iOS: web push works only for installed PWAs on recent iOS versions. In-app realtime and the SMS log cover the rest.

Camera scanning: requires HTTPS and camera permission; manual short code is always available.

Community help: SOS to nearby members never replaces emergency services. Every alert tells the recipient to call 112 first, not to confront anyone, and responding is optional.

10. Acceptance Tests and Demo Script

#

Scenario

Expected result

1

Passenger and rider sign up on two phones, pass verification steps

Both portals show progress; rider vehicle approved; role switcher works

2

Nightly job runs on seeded schedules

PB shows a Ghost card with confidence; RD shows the matching trip card

3

Passenger confirms, rider opens seats

Pod forms, both dashboards show the pod and driver rotation

4

Passenger taps 'I'm waiting' at a hotspot from within 100 m

SafeTrail starts; rider sees live count and detour; tapping from farther away is blocked

5

Rider scans passenger QR, then tries a screenshot of the same QR

First scan accepted and ride Verified; second rejected as already used

6

Exact pickup point before both confirm

Not visible in either portal; visible only after both confirm and within 10 minutes of pickup

7

GPS simulator sends the rider 400 m off route

Soft check-in fires; no reply in 60 seconds sends the contact link and starts SOS

8

SOS fires with a moderator and a normal user nearby

Contacts and support notified first; moderator alerted; after 60 seconds the normal user is alerted; map lights up

9

Relay pass with two pool legs and a bus leg

Scan at pickup, handoff scan closes leg 1 and starts leg 2, both legs settle

10

Ride completed

Fare split with reason shown on both sides, rider sees cost recovery under cap, feedback updates trust and streak

11

Passenger requests women-only pod with Trusted minimum

Only matching riders appear

12

Moderator reviews a flagged ride

Anonymised case view; action appears in the audit log; conflict-of-interest case blocked

11. Build Order, Risks and Assumptions

11.1 Suggested build order

Foundation: auth, roles and role switcher, database, RLS, map shell, seed data for one corridor and one campus.

Core loop: offers, requests, matching, hotspots, 'I'm waiting', QR pass and scanner, ride status machine.

Safety: SafeTrail tracking, deviation engine, contact link, SOS with tiers and live map.

Trust and moderation: trust engine, tiers, badges, moderator queue and audit log.

Intelligence: Ghost Commutes, pods, standby, Relay planner and multi-leg pass.

Money and polish: Fair-Fare, wallet, settlement, demo GPS simulator, demo dataset and script rehearsal.

11.2 Risks

Risk

Mitigation

Ranking gamed by friends

Trust-weighted ratings and ring detection

Empty hotspots early

Launch 3 to 5 hotspots on one corridor and one college; seeded simulated users for demo

GPS spoofing

Co-presence check at scan, anomaly detection, daily caps

Moderator abuse

Audit log, limited data, community rating, demotion

False SOS

Trust penalty and moderator review

Scope size for one build

Strict P0/P1 split and sandbox adapters

11.3 Assumptions to confirm

'Two dashboards' is read as two portals: Peer Booking (passenger) and Rider (vehicle owner). If a separate moderator or admin dashboard is wanted, moderator tools move out of both portals into that one.

Pilot corridor, campus and bus routes are seeded from the idea document's example (Peelamedu to campus) and can be replaced.

Weights, thresholds and timings in section 6 are defaults to tune after testing.