import fs from 'fs';
import path from 'path';

const KNOWLEDGE_FILE_PATH = path.join(process.cwd(), 'conocimiento', 'conocimiento.txt');
const KNOWLEDGE_CACHE_KEY = '__levanteKnowledgeCache';
const KNOWLEDGE_MTIME_KEY = '__levanteKnowledgeMtimeMs';
const KNOWLEDGE_LAST_CHECK_KEY = '__levanteKnowledgeLastCheckMs';
const KNOWLEDGE_CHECK_INTERVAL_MS = process.env.NODE_ENV === 'development' ? 1000 : 5000;

function readKnowledgeFromDisk() {
  const stats = fs.statSync(KNOWLEDGE_FILE_PATH);
  const knowledge = fs.readFileSync(KNOWLEDGE_FILE_PATH, 'utf8');

  globalThis[KNOWLEDGE_CACHE_KEY] = knowledge;
  globalThis[KNOWLEDGE_MTIME_KEY] = stats.mtimeMs;
  globalThis[KNOWLEDGE_LAST_CHECK_KEY] = Date.now();

  return knowledge;
}

function loadKnowledgeOnce() {
  if (typeof globalThis[KNOWLEDGE_CACHE_KEY] === 'string') {
    return globalThis[KNOWLEDGE_CACHE_KEY];
  }

  return readKnowledgeFromDisk();
}

function maybeRefreshKnowledge() {
  const now = Date.now();
  const lastCheck = globalThis[KNOWLEDGE_LAST_CHECK_KEY] || 0;

  if (now - lastCheck < KNOWLEDGE_CHECK_INTERVAL_MS) {
    return;
  }

  globalThis[KNOWLEDGE_LAST_CHECK_KEY] = now;

  const stats = fs.statSync(KNOWLEDGE_FILE_PATH);
  const currentMtime = globalThis[KNOWLEDGE_MTIME_KEY] || 0;

  if (stats.mtimeMs !== currentMtime) {
    readKnowledgeFromDisk();
  }
}

// Eager load at module init to avoid disk reads during request handling.
loadKnowledgeOnce();

export function getKnowledge() {
  maybeRefreshKnowledge();
  return globalThis[KNOWLEDGE_CACHE_KEY];
}