/**
 * Zero-beginner finger placement drills (front-end only, no backend).
 * Steps 1–4: key combinations. Steps 5–6: words/sentences for later practice.
 * Each drill line is 6–12 characters for steady rhythm (session mode uses 10 lines per round).
 */

/** @typedef {'homeRow' | 'topRow' | 'bottomRow' | 'numbers' | 'words' | 'sentences'} StageId */

/** 每条 session 的练习条数 */
export const SESSION_SIZE = 10;

export const STAGE_ORDER = /** @type {const} */ ([
  'homeRow',
  'topRow',
  'bottomRow',
  'numbers',
  'words',
  'sentences',
]);

export const DEFAULT_STAGE_ID = /** @type {StageId} */ ('homeRow');

export const STAGES = {
  homeRow: {
    id: /** @type {StageId} */ ('homeRow'),
    step: 1,
    title: 'Step 1: Home Row',
    shortLabel: 'Home Row',
    description: 'Home keys only — no full words yet',
    keyHint: 'Home Row keys: A S D F J K L ;',
    laterStage: false,
    drills: [
      'asdf jkl',
      'asdf jkl;',
      'as as df df',
      'jk jk l; l;',
      'fj fj dk dk',
      'ja ja sk sk',
      'a;s kf jd',
      'fdsa ;lkj',
      'ask ask df',
      'jkl jkl as',
      'fafa jkjk',
      'dada l;l;',
      'sasa fjfj',
      'kjkj dede',
      'afjk sl;d',
      'sa df jk l;',
      'fa sl dk j;',
    ],
  },
  topRow: {
    id: /** @type {StageId} */ ('topRow'),
    step: 2,
    title: 'Step 2: Top Row',
    shortLabel: 'Top Row',
    description: 'Home row + top letters (Q–P pairs)',
    keyHint: 'Top Row with home row support — use home keys plus Q W E R U I O P.',
    laterStage: false,
    drills: [
      'aq sw de fr',
      'ju ki lo ;p',
      'aq aq sw sw',
      'de fr ju ki',
      'aqde swfr',
      'jukilo ;p;p',
      'qa ws ed rf',
      'uj ik ol p;',
      'qaws edrf',
      'ujik ol;p;',
      'aq ws de fr',
      'ju ki lo p;',
      'aq ju sw ki',
      'de lo fr ;p',
      'aqsw defr',
      'jukilo p;p',
      'ripe aqua',
      'jump aqua',
    ],
  },
  bottomRow: {
    id: /** @type {StageId} */ ('bottomRow'),
    step: 3,
    title: 'Step 3: Bottom Row',
    shortLabel: 'Bottom Row',
    description: 'Home row + bottom letters (Z–M, symbols)',
    keyHint: 'Bottom Row with home row support — use home keys plus Z X C V N M , . /',
    laterStage: false,
    drills: [
      'az sx dc fv',
      'jn km l, ;.',
      'az az sx sx',
      'dc fv jn jn',
      'azsx dcfv',
      'jnkm l,;.',
      'za xs cd vf',
      'nj mk ,l .;',
      'zaxs cdev',
      'njmk ,l.;',
      'az sx dc fv',
      'jn km l, ;.',
      'az jn sx km',
      'dc l, fv ;.',
      'az fv dc sx',
      'za sx jn km',
      'lazy zoom',
      'cave maze',
    ],
  },
  numbers: {
    id: /** @type {StageId} */ ('numbers'),
    step: 4,
    title: 'Step 4: Numbers',
    shortLabel: 'Numbers',
    description: 'Number keys only',
    keyHint: 'Number keys practice.',
    laterStage: false,
    drills: [
      '123456',
      '789012',
      '135790',
      '246813',
      '123 456',
      '789 012',
      '12 34 56',
      '78 90 12',
      '102938',
      '475869',
      '314159',
      '271828',
      '12345678',
      '98765432',
      '11223344',
      '55667788',
    ],
  },
  words: {
    id: /** @type {StageId} */ ('words'),
    step: 5,
    title: 'Step 5: Words',
    shortLabel: 'Words',
    description: 'Later stage — short words after finger basics',
    keyHint:
      'Short words — use this step after you feel good with home, top, bottom rows and numbers.',
    laterStage: true,
    drills: [
      'cat dog',
      'sun fun',
      'play jump',
      'blue tree',
      'hand ship',
      'star read',
      'write code',
      'happy learn',
      'quick brown',
      'lazy jumps',
      'small words',
      'type fast',
      'keep calm',
      'good work',
      'nice try',
      'well done',
    ],
  },
  sentences: {
    id: /** @type {StageId} */ ('sentences'),
    step: 6,
    title: 'Step 6: Sentences',
    shortLabel: 'Sentences',
    description: 'Later stage — full sentences',
    keyHint:
      'Sentences — practice when your fingers remember the keys without looking down.',
    laterStage: true,
    drills: [
      'The cat.',
      'I see it.',
      'We go up.',
      'Run to me.',
      'A red sun.',
      'Birds sing.',
      'Type daily.',
      'Friends here',
      'Stars in sky',
      'Learning fun',
      'Morning sun',
      'Good story',
    ],
  },
};

/**
 * @param {StageId} stageId
 * @returns {string[]}
 */
export function getDrillsForStage(stageId) {
  return STAGES[stageId]?.drills ?? [];
}

/**
 * 从阶段题库中按块取出固定条数的练习（循环取满一轮 session）。
 * @param {StageId} stageId
 * @param {number} chunkIndex 第几组（0 为第一组 10 条）
 * @param {number} [size]
 * @returns {string[]}
 */
export function getSessionDrillsForStage(stageId, chunkIndex = 0, size = SESSION_SIZE) {
  const all = getDrillsForStage(stageId);
  if (all.length === 0) return [];
  const out = [];
  const start = chunkIndex * size;
  for (let i = 0; i < size; i++) {
    out.push(all[(start + i) % all.length]);
  }
  return out;
}

/**
 * @param {StageId} stageId
 */
export function getStage(stageId) {
  return STAGES[stageId];
}
