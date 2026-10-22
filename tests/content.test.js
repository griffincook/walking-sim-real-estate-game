import test from 'node:test';import assert from 'node:assert/strict';import{world,traces,sources,chapters,loadGame,traceAt,saveStory,nearbySteps,foundStories,normalisePosition,travelTarget,logBookEntries,roomName}from'../src/game.js';
test('each tour room has exactly one unique sourced story',()=>{const rooms=[...new Set(world.map(p=>p.roomId))];assert.equal(rooms.length,15);assert.equal(traces.length,rooms.length);assert.equal(new Set(traces.map(t=>t.id)).size,traces.length);for(const room of rooms)assert.equal(traces.filter(t=>t.roomIds.includes(room)).length,1);for(const t of traces){assert.ok(chapters.some(c=>c.id===t.chapter));assert.ok(t.body&&t.reflection&&t.detail);assert.ok(t.sources.length);for(const id of t.sources)assert.ok(sources.some(s=>s.id===id));assert.equal(t.reviewedAt,'2026-10-21')}});
test('story follows room identity throughout every panorama',()=>{for(const p of world){const t=traceAt(p.id);assert.ok(t);assert.ok(t.roomIds.includes(p.roomId));for(const q of world.filter(q=>q.roomId===p.roomId))assert.equal(traceAt(q.id).id,t.id)}assert.equal(traceAt(99999),null)});
test('all rooms can be reached by neighbouring viewpoints and documented stair gates',()=>{const visited=new Set(),queue=[7];while(queue.length){const id=queue.shift();if(visited.has(id))continue;visited.add(id);for(const n of nearbySteps(id)){assert.ok(world.some(p=>p.id===n.pano));queue.push(n.pano)}}assert.equal(visited.size,world.length);assert.ok(nearbySteps(6).some(s=>s.label==='Upstairs'));assert.ok(world.some(p=>nearbySteps(p.id).some(s=>s.label==='Downstairs')))});
test('saved transcript lookup excludes undiscovered stories; reading does not imply saving or moving',()=>{let game={pano:10007,chapter:'present',found:[]};assert.deepEqual(foundStories(game.found),[]);const story=traceAt(game.pano);assert.equal(game.found.length,0);const saved=saveStory(game,story.id);assert.equal(saved.pano,game.pano);assert.equal(saved.found.length,1);assert.equal(saveStory(saved,story.id).found.length,1);assert.deepEqual(foundStories(saved.found).map(t=>t.id),[story.id]);assert.equal(saveStory(game,'bad'),game)});
test('free exploration supports any discovery order without prescribed destinations',()=>{let game={pano:7,chapter:'present',found:[]};for(const p of [...world].reverse()){const t=traceAt(p.id);game=saveStory({...game,pano:p.id},t.id);assert.equal(game.pano,p.id)}assert.equal(game.found.length,traces.length);assert.equal(foundStories(game.found).length,15)});
test('new saves recover corrupt data and old four-story saves migrate',()=>{const storage=v=>({getItem:k=>k==='harrison-game-v3'?v:null});for(const v of ['{','null','[]'])assert.deepEqual(loadGame(storage(v)).found,[]);assert.equal(loadGame({getItem:()=>{throw Error()}}).pano,7);const old=loadGame({getItem:k=>k==='harrison-game-v2'?JSON.stringify({pano:19,chapter:'family',found:['threshold','trade','cedarlea','family']}):null});assert.deepEqual(old.found,['foyer','living','bedroom-west','kitchen']);const current=loadGame(storage(JSON.stringify({pano:99999,chapter:'bad',found:['family','family','unknown']})));assert.deepEqual(current,{pano:7,chapter:'present',found:['family']})});
test('movement payloads resolve panorama identity',()=>{assert.equal(normalisePosition(19),19);assert.equal(normalisePosition({id:10007}),10007);assert.equal(normalisePosition({panoId:7}),7)});

test('log book includes every story with separate discovered and undiscovered states',()=>{
 const empty=logBookEntries([],7);assert.equal(empty.length,15);assert.ok(empty.every(e=>!e.discovered));assert.equal(empty.filter(e=>e.here).length,1);
 const partial=logBookEntries(['porch','living'],9);assert.equal(partial.filter(e=>e.discovered).length,2);assert.ok(partial.find(e=>e.story.id==='living').here);assert.equal(partial.filter(e=>!e.discovered).length,13);
 assert.ok(logBookEntries(traces.map(t=>t.id),7).every(e=>e.discovered));
});
test('fast travel resolves a real panorama in each story room without saving discoveries',()=>{
 const game={pano:7,chapter:'present',found:[]};
 for(const t of traces){const destination=travelTarget(t.id,game.pano);assert.ok(world.some(p=>p.id===destination&&t.roomIds.includes(p.roomId)));assert.equal(traceAt(destination).id,t.id);assert.deepEqual(game.found,[])}
 assert.equal(travelTarget('bad',7),null);assert.equal(travelTarget('living',10),10);
 const bedroom=travelTarget('bedroom-west',7);assert.equal(world.find(p=>p.id===bedroom).floor,'2nd Floor');
});

test('owner room corrections are reflected in labels, story location and fast travel',()=>{
 assert.equal(roomName(48),'Landing');assert.ok(world.filter(p=>p.roomId===48).every(p=>p.room==='Landing'));
 const crib=traces.find(t=>t.chapter==='cedarlea');assert.deepEqual(crib.roomIds,[41]);assert.equal(roomName(41),'Bedroom 1');assert.equal(traceAt(10005).id,crib.id);assert.equal(travelTarget(crib.id,7),10005);assert.ok(crib.sources.includes('owner-notes'));
 assert.equal(traceAt(10007).sources[0],'manse');
});
test('room anchors are documented and domestic comparisons are explicit',()=>{
 for(const t of traces)assert.ok(t.roomAnchor&&t.roomAnchor.length>12);
 const owner=sources.find(s=>s.id==='owner-notes');assert.equal(owner.url,null);
 for(const t of traces.filter(t=>t.sources.includes('bethune-house')))assert.match(t.reflection,/Bethune/);
 for(const id of ['laundry','ensuite']){const t=traces.find(t=>t.id===id);assert.ok(!t.sources.includes('redevelopment'));assert.ok(!t.sources.includes('square'))}
 const kitchenPanos=world.filter(p=>p.roomId===35).map(p=>p.id);assert.ok(world.some(p=>p.roomId===36&&p.neighbours.some(n=>kitchenPanos.includes(n))));
});
