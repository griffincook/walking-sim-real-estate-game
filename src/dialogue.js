export function dialoguePages(story,limit=240){
 const sections=[['THE STORY',story.body],['LOOK CLOSER',story.reflection]];
 const pages=[];
 for(const [label,text]of sections){if(!text)continue;let page='';const segments=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('en',{granularity:'sentence'}).segment(text)].map(s=>s.segment.trim()):text.match(/[^.!?]+[.!?]*/g)?.map(s=>s.trim())||[text];
  for(const sentence of segments){for(const word of sentence.split(/\s+/)){if(page&&page.length+word.length+1>limit){pages.push({label,text:page});page=''}page=page?`${page} ${word}`:word}}
  if(page)pages.push({label,text:page});
 }
 return pages;
}
export function readingTime(text){return Math.max(2800,text.trim().split(/\s+/).length*340)+1000}
export function createNarrator(env){let active=null;const synth=env?.speechSynthesis,Utterance=env?.SpeechSynthesisUtterance;const available=!!(synth&&Utterance);function stop(){active=null;if(available)synth.cancel()}
 return {available,stop,speak(text,{onEnd=()=>{},onError=()=>{},onStart=()=>{}}={}){stop();if(!available){onError();return}try{const u=new Utterance(text);active=u;u.lang='en-CA';u.rate=.94;const voices=synth.getVoices?.()||[];const voice=voices.find(v=>v.lang==='en-CA')||voices.find(v=>/^en[-_]/i.test(v.lang));if(voice)u.voice=voice;u.onstart=()=>{if(active===u)onStart()};u.onend=()=>{if(active===u){active=null;onEnd()}};u.onerror=()=>{if(active===u){active=null;onError()}};synth.speak(u)}catch{active=null;onError()}}};
}
