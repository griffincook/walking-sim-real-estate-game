import world from './world.json' with { type: 'json' };
import traces from './stories.json' with { type: 'json' };
import sources from './sources.json' with { type: 'json' };
export {world,traces,sources};
export const TOUR='https://youriguide.com/lunnf_55_brock_st_e_uxbridge_on/';
export const EMBED='https://youriguide.com/embed/lunnf_55_brock_st_e_uxbridge_on/?api=1&autostart=1&noinitanimation=1&nomenu&nogallery&nodetails&pano=7';
export const chapters=[{id:'present',label:'The house today',date:'PRESENT DAY',tone:'#d1ccbc'},{id:'harrison',label:'The Harrison residence',date:'THE EARLY CHAPTER',tone:'#ccad77'},{id:'trade',label:'A working town',date:'HARRISON’S TRADE',tone:'#b9916b'},{id:'cedarlea',label:'Cedarlea',date:'FROM 1949',tone:'#b7c7c3'},{id:'family',label:'Home, again',date:'THE CONTINUING STORY',tone:'#c3bea3'},{id:'future',label:'A town looking ahead',date:'PLANS & POSSIBILITIES',tone:'#c8bbd0'}];
export function loadGame(storage){try{const current=storage.getItem('harrison-game-v3');const d=JSON.parse(current||storage.getItem('harrison-game-v2')||'{}');const aliases={threshold:'foyer',trade:'living',cedarlea:'bedroom-west',family:'kitchen'};const raw=Array.isArray(d.found)?d.found:[];const found=[...new Set(raw.map(id=>current?id:aliases[id]||id).filter(id=>traces.some(t=>t.id===id)))];return {pano:world.some(p=>p.id===d.pano)?d.pano:7,found,chapter:chapters.some(c=>c.id===d.chapter)?d.chapter:'present'}}catch{return {pano:7,found:[],chapter:'present'}}}
export function traceAt(pano){const p=world.find(p=>p.id===pano);return traces.find(t=>t.roomIds.includes(p?.roomId))||null}
export function normalisePosition(p){return typeof p==='number'?p:Number(p?.id??p?.panoId??p?.position)}
export function saveStory(game,id){const t=traces.find(t=>t.id===id);return t?{...game,found:[...new Set([...game.found,id])],chapter:t.chapter}:game}
export function nearbySteps(pano){const p=world.find(p=>p.id===pano);if(!p)return [];const sameFloor=p.neighbours.map(id=>world.find(q=>q.id===id)).filter(Boolean).map(q=>({pano:q.id,label:q.room,roomId:q.roomId}));return [...sameFloor,...(p.stairs||[])]}
export function foundStories(found){return traces.filter(t=>found.includes(t.id))}
export function roomName(roomId){return ({30:'Living room',34:'Family room',36:'Dining room',35:'Kitchen',28:'Foyer',38:'Front porch',55:'Hall',29:'Deck',48:'Landing',51:'Bathroom',41:'Bedroom 1',42:'Bedroom 2',39:'Primary bedroom',43:'Laundry',44:'Ensuite'})[roomId]||'Room'}
export function travelTarget(storyId,currentPano){const story=traces.find(t=>t.id===storyId);if(!story)return null;const current=world.find(p=>p.id===currentPano);if(current&&story.roomIds.includes(current.roomId))return current.id;return world.find(p=>story.roomIds.includes(p.roomId))?.id??null}
export function logBookEntries(found,currentPano){return traces.map(story=>({story,discovered:found.includes(story.id),target:travelTarget(story.id,currentPano),here:traceAt(currentPano)?.id===story.id}))}
