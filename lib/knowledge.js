import fs from 'fs';
import path from 'path';

const KNOWLEDGE_FILE_PATH = path.join(process.cwd(), 'conocimiento', 'conocimiento.txt');
const KNOWLEDGE_CACHE_KEY = '__levanteKnowledgeCache';

export function getKnowledge() {
  if (globalThis[KNOWLEDGE_CACHE_KEY]) {
    return globalThis[KNOWLEDGE_CACHE_KEY];
  }

  const knowledge = fs.readFileSync(KNOWLEDGE_FILE_PATH, 'utf8');
  globalThis[KNOWLEDGE_CACHE_KEY] = knowledge;

  return knowledge;
}