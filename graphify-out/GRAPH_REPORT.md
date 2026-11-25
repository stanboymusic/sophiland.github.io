# Graph Report - regalo-sophia  (2026-10-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 74 nodes · 151 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5a2846e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- js/script.js
- garden.js
- parche 1/js/data.js
- parche 1/js/script.js
- getOrCreateGardenDoc
- renderOnboarding
- garden-ui.js
- escHtml
- openGarden
- js/data.js

## God Nodes (most connected - your core abstractions)
1. `renderGardenView()` - 22 edges
2. `renderOnboarding()` - 9 edges
3. `openGarden()` - 9 edges
4. `GARDEN_DOC()` - 8 edges
5. `getOrCreateGardenDoc()` - 7 edges
6. `modalInner()` - 6 edges
7. `renderPetNameModal()` - 6 edges
8. `todayVE()` - 5 edges
9. `waterGarden()` - 5 edges
10. `renderHouseNameModal()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `renderGardenView()` --calls--> `getOrCreateGardenDoc()`  [EXTRACTED]
  js/garden-ui.js → js/garden.js
- `openGarden()` --calls--> `getOrCreateGardenDoc()`  [EXTRACTED]
  js/garden-ui.js → js/garden.js
- `unlock()` --calls--> `loadContent()`  [EXTRACTED]
  js/script.js → js/firebase.js
- `renderGardenView()` --calls--> `adoptPet()`  [EXTRACTED]
  js/garden-ui.js → js/garden.js
- `renderGardenView()` --calls--> `buildNextStage()`  [EXTRACTED]
  js/garden-ui.js → js/garden.js

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "js/script.js"
Cohesion: 0.17
Nodes (10): app, db, firebaseConfig, loadContent(), currentGalleryPhotos, initPoemAccordion(), pad(), renderAll() (+2 more)

### Community 1 - "garden.js"
Cohesion: 0.23
Nodes (15): adoptPet(), buildNextStage(), canPostToday(), canWaterToday(), db, existingApps, GARDEN_DOC(), getMessages() (+7 more)

### Community 2 - "parche 1/js/data.js"
Cohesion: 0.29
Nodes (6): bookChapters, diaryEntries, galleryPhotos, poems, START_DATE, TARGET_DATE

### Community 3 - "parche 1/js/script.js"
Cohesion: 0.43
Nodes (4): pad(), renderAll(), unlock(), updateCountdown()

### Community 4 - "getOrCreateGardenDoc"
Cohesion: 0.40
Nodes (6): getOrCreateGardenDoc(), setHouseName(), setPetName(), modalInner(), renderHouseNameModal(), renderPetNameModal()

### Community 5 - "renderOnboarding"
Cohesion: 0.40
Nodes (4): createGarden(), setLocalRole(), lilySmallSVG(), renderOnboarding()

### Community 6 - "garden-ui.js"
Cohesion: 0.60
Nodes (4): closeGarden(), lilyClusterSVG(), modal(), singleLily()

### Community 7 - "escHtml"
Cohesion: 0.40
Nodes (5): escHtml(), houseSVG(), renderHouseSection(), renderMessages(), renderPetsSection()

### Community 8 - "openGarden"
Cohesion: 0.50
Nodes (4): getLocalName(), getLocalRole(), initGardenButton(), openGarden()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderGardenView()` connect `garden.js` to `getOrCreateGardenDoc`, `renderOnboarding`, `garden-ui.js`, `escHtml`, `openGarden`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `renderOnboarding()` connect `renderOnboarding` to `openGarden`, `garden.js`, `getOrCreateGardenDoc`, `garden-ui.js`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `getOrCreateGardenDoc()` connect `getOrCreateGardenDoc` to `openGarden`, `garden.js`, `garden-ui.js`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._