import React from 'react';
export default function SourceReference({source}){return source.url?<a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>:<span className="source-observation">{source.title} <small>Owner observation</small></span>}
