/* BeardAI 5.0 Royal Workbench: validated local-first record operations, Node-testable. */
(function (root, factory) {
  const lib = factory();
  if (typeof module === 'object' && module.exports) module.exports = lib;
  else root.BeardAIWorkbenchCore = lib;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const STAGES = Object.freeze(['Ideas', 'Planned', 'In progress', 'Review', 'Done']);
  const PRIORITIES = Object.freeze(['Normal', 'High', 'Critical']);
  const MAX_RECORDS = 250;
  const MAX_IMPORT_BYTES = 512 * 1024;
  function cleanText(value, length) { return typeof value === 'string' ? value.trim().slice(0, length) : ''; }
  function cleanDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
    const d = new Date(value + 'T12:00:00Z');
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value ? value : '';
  }
  function normalize(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
    const title = cleanText(input.title, 120);
    if (title.length < 3) return null;
    const id = cleanText(input.id, 90) || 'import-' + title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24);
    const stage = STAGES.includes(input.stage) ? input.stage : 'Ideas';
    const priority = PRIORITIES.includes(input.priority) ? input.priority : 'Normal';
    const created = typeof input.created === 'string' && !Number.isNaN(Date.parse(input.created)) ? new Date(input.created).toISOString() : new Date(0).toISOString();
    return { id, title, notes: cleanText(input.notes, 2000), stage, priority, due: cleanDate(input.due), created };
  }
  function normalizeMany(items) {
    if (!Array.isArray(items)) throw new Error('Records must be an array.');
    if (items.length > MAX_RECORDS) throw new Error('Maximum ' + MAX_RECORDS + ' records per file.');
    const seen = new Set();
    const result = [];
    for (const item of items) {
      const value = normalize(item);
      if (!value) throw new Error('A record is invalid or its title is too short.');
      if (seen.has(value.id)) throw new Error('Duplicate record IDs in backup.');
      seen.add(value.id);
      result.push(value);
    }
    return result;
  }
  function parseBackup(text) {
    if (typeof text !== 'string' || text.length > MAX_IMPORT_BYTES) throw new Error('Backup is too large.');
    let data;
    try { data = JSON.parse(text); } catch (_) { throw new Error('Backup is not valid JSON.'); }
    if (!data || typeof data !== 'object' || ![1, 2].includes(data.schema)) throw new Error('Unsupported backup format.');
    return normalizeMany(data.records);
  }
  function merge(existing, incoming, mode) {
    if (!['merge', 'replace'].includes(mode)) throw new Error('Unknown import mode.');
    const left = normalizeMany(existing);
    const right = normalizeMany(incoming);
    if (mode === 'replace') return right;
    const out = left.slice(), byId = new Set(out.map(x => x.id));
    for (const entry of right) {
      if (byId.has(entry.id)) continue;
      if (out.length >= MAX_RECORDS) throw new Error('Merge would exceed ' + MAX_RECORDS + ' records.');
      out.push(entry);
      byId.add(entry.id);
    }
    return out;
  }
  function serialize(records) {
    return JSON.stringify({ schema: 2, product: 'BeardAI Royal Workbench', exported: new Date().toISOString(), records: normalizeMany(records) }, null, 2);
  }
  function stats(records) {
    const x = normalizeMany(records);
    return { count: x.length, done: x.filter(a => a.stage === 'Done').length, critical: x.filter(a => a.priority === 'Critical' && a.stage !== 'Done').length };
  }
  return Object.freeze({ STAGES, PRIORITIES, MAX_RECORDS, MAX_IMPORT_BYTES, normalize, normalizeMany, parseBackup, merge, serialize, stats });
});
