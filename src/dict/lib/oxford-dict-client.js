const axios = require('axios');
const _ = require('lodash');
const httpStatus = require('http-status');

class OxfordDictError extends Error {
  constructor(message = 'An error occurs when getting data from Oxford', meta) {
    super(message);
    this.name = this.constructor.name;
    this.meta = meta;
  }
}

/**
 * A Helper to call Oxford API
 */
class OxfordDictClient {
  constructor({
    appId,
    appKey,
    baseUrl = 'https://od-api.oxforddictionaries.com/api/v1',
    language = 'en', // default to English dictionary
  } = {}) {
    this.baseUrl = baseUrl;
    this.appId = appId;
    this.appKey = appKey;
    this.language = language;
  }

  /**
  * Get the word definition
  * @param {string} word
  * @public
  */
  async getDefinition(word) {
    const [result] = await this.execute(`${this.baseUrl}/entries/${this.language}/${word}`);
    return _.map(result.lexicalEntries, lexicalEntry => ({
      definition: lexicalEntry.entries[0].senses[0].definitions[0],
      type: lexicalEntry.lexicalCategory,
    }));
  }

  /**
  * Get the word synonym
  * @param {string} word
  * @public
  */
  async getSynonym(word) {
    const [result] = await this.execute(`${this.baseUrl}/entries/${this.language}/${word}/synonyms`);
    return _.map(result.lexicalEntries, lexicalEntry => ({
      synonyms: _.map(lexicalEntry.entries[0].senses[0].synonyms, 'text'),
      type: lexicalEntry.lexicalCategory,
    }));
  }

  /**
  * Make an api request to Oxford API. It will throw an error
  * when failing to make an API call.
  * @param {string} url
  * @private
  */
  execute(url) {
    const config = {
      url,
      method: 'get',
      headers: {
        accept: 'application/json',
        app_id: this.appId,
        app_key: this.appKey,
      },
    };
    return axios(config)
      .then(({ data }) => _.get(data, 'results'))
      .catch((err) => {
        let message;
        if (_.get(err, 'response.status') === httpStatus.NOT_FOUND) {
          message = 'The word does not exist';
        } else {
          message = 'Fail to fetch data from Oxford API';
        }
        throw new OxfordDictError(message, {
          url,
        });
      });
  }
}

module.exports = OxfordDictClient;
