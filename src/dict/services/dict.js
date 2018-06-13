const _ = require('lodash');
const Bluebird = require('bluebird');
const config = require('config');

const OxfordDictClient = require('../lib/oxford-dict-client');

const oxfordDictClient = new OxfordDictClient({
  appId: config.get('dict.oxford.appId'),
  appKey: config.get('dict.oxford.appKey'),
});

/**
 * Join words together with , as a delimiter except the last word
 * that will be joined with `and`
 * @param {Array<string>} words
 * @returns {string}
 */
function processSynonymsText(words) {
  return [
    words.slice(0, -1).join(', '),
    words.slice(-1)[0],
  ].join(words.length < 2 ? '' : ' and ');
}

/**
 * Get definition and synonym for word
 * @param {string} word
 * @public
 * @returns
 */
async function get(word) {
  const [definitions, synonyms] = await Bluebird.all([
    oxfordDictClient.getDefinition(word),
    oxfordDictClient.getSynonym(word),
  ]);
  const resolvedSynonyms = processSynonymsText(_.take(synonyms[0].synonyms, 5));

  return {
    definition: definitions[0].definition,
    synonyms: resolvedSynonyms,
  };
}

module.exports = {
  get,
};
