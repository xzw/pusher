/**
 * agenda configuration
 */

'use strict';

module.exports = function (agenda,config) {

    agenda.database(config.mongo.uri,config.agenda.collectionName)
        .processEvery(config.agenda.processEvery)
        .maxConcurrency(config.agenda.maxConcurrency)
        .defaultConcurrency(config.agenda.defaultConcurrency)
        .defaultLockLifetime(config.agenda.defaultLockLifetime)
        .name(config.agenda.name)
}