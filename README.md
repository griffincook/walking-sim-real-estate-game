# Harrison House — The house remembers
A free-exploration historical experience using the real property's full-screen hosted iGUIDE panoramas. React / Vite / official @iguide/viewer API.

## Run
Node 20.19+ or 22+. `npm install`, `npm run dev`, `npm test`, `npm run build`.

## Visitor experience
Walk using the tour floor markers. Every one of its 15 panoramic rooms/spaces reveals one different story. Discover story opens an in-world dialogue strip rather than a story modal. Text reveals progressively, with manual next/back, instant text, optional auto-advance, and optional browser speech synthesis (off by default for each story). The final passage saves to the log book and keeps the visitor in place. Narration is cancelled on passage changes, closing, opening another panel, and tab hiding; unsupported or failed speech falls back to text. Reduced-motion preference uses instant text. The log book lists all 15 stories with Found/Undiscovered badges, room/floor labels and optional fast travel to each real panoramic room. Only found entries expose transcripts, citations and replay. Travel closes the log book without adding a discovery; in-room story completion still saves progress. No prescribed order or automatic room changes. Optional fast travel is available in the log book; nearby movement remains available separately. The optional Nearby steps panel provides keyboard-accessible movement to adjacent panoramic viewpoints and official stair-gate connections. Clearing progress preserves the visitor’s current position. Version 2's four discoveries migrate to corresponding version 3 stories.

## Content
- `src/stories.json`: 15 editorial records, room identity, topic, chapter, factual body, interpretive reflection, qualifications, sources and review date.
- `src/sources.json`: source register, primary-source links and scope/limitations.
- `src/world.json`: actual public tour panorama IDs, room identity, native neighbour links, and stair exits derived from iGUIDE gates. No copied panorama photographs.
- `src/game.js`: state persistence/migration, story lookup, log book and adjacent-navigation rules.
- `src/dialogue.js`: bounded narrative text segmentation (archival qualifications stay in Sources and full log-book transcripts), reading timing and browser narration lifecycle.
- `src/StoryPlayer.jsx`: nonmodal narrative dialogue, typewriter reveal, optional voice/auto, keyboard navigation and sources.
- `src/main.jsx`: viewer integration and interface. Story availability follows completed navigation events from the actual tour.

Stories now begin with the specific room: main-floor proportions, the hall and Harrison’s walk to work, kitchen/dining use, the deck and deep garden, the upstairs Landing, crib/Cedarlea in Bedroom 1, Montgomery in Bedroom 2, the private primary suite, upstairs laundry and bathing. The porch holds downtown plans; laundry/ensuite no longer carry unrelated redevelopment stories. Parks Canada’s Bethune/Green Gables material is explicitly comparative domestic history. Each story has a roomAnchor editorial field. Owner observations are recorded without inventing an external source URL.

## Research boundaries
Research reviewed 21 October 2026. House dates conflict in the register. Main Street harness business documented, on-site workshop unverified. Owner confirms Den should be Landing and the crib is in Bedroom 1. Browser access to iGUIDE was declined again during this revision; room furnishings were not independently inspected. No private family or patient histories invented. Future plans are conditional/conceptual, not completion claims. The flood story describes municipal downtown context, never property-specific risk. No exact walking time or distance is promised. Tour spaces without panoramic access are excluded.

## Validation
Sixteen automated tests cover owner-corrected Landing and crib-room mapping, room-anchor/source integrity, plus full-index discovery states, fast-travel destination validity and unchanged discovery state, plus dialogue text preservation (including qualifications), bounded passages, auto-reading timing, cancellation of obsolete narration callbacks, unavailable/error speech recovery, plus exact one-story-per-room coverage and source references; consistent stories across every panorama of the same room; whole-house reachability through adjacent viewpoints and official stairs; saved transcript visibility and saving without movement; free-order completion; corrupt-state recovery and prior-save migration; and viewer position parsing. Production build passes. Visual/touch, actual voice playback, external viewer interactions and screen-reader behaviour require browser QA; local browser permission was previously declined. No claim of complete accessibility conformance.

## Hosting and media
Static `dist/` on Sites, retaining owner-private access. Original iGUIDE host serves the photographic environment. No AI/cartoon reconstruction or rehosted listing imagery. Retry/original-tour link handles unavailable loading. Google Fonts and iGUIDE are external connections. Log book storage stays in the browser.
