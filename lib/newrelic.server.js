const newrelic = require('newrelic')
import Vue from 'vue'
const util = require('util')

export default function (context, inject) {
    const instrumentationApi = newrelic.shim;

    if (!Vue.__newrelic_mixin__) {
        Vue.__newrelic_mixin__ = true
        Vue.mixin({
            //dont use lambda function because arrow functions do not have `this` refereance
            beforeCreate: function () {
                /* DOES NOT WORK AS THERE IS NO WAY TO PASS componentSegment reference to `created` hook function*/
                /*
                const parentSegment = instrumentationApi.getActiveSegment()
                if (!parentSegment) {
                    logger.trace('No active segment found at query start. Not recording.')
                    return null
                }

                // We do not set to active here as batched queries will hit this
                // back to back and we'd prefer those not nest with each-other.
                const componentSegment = instrumentationApi.createSegment(
                    UNKNOWN_OPERATION,
                    recordOperationSegment,
                    parentSegment
                )

                if (!componentSegment) {
                    logger.trace('Operation segment was not created. Not recording.')
                    return null
                }

                componentSegment.start()
                //??? how to store componentSegment so it can passed to `created` fuction?
                */

                //console.log(`About to create ${this.$options.name} component`)
            },
            created: function () {
                /* DOES NOT WORK AS NO REFERENCE TO componentSegment created in `beforeCreate` */
                /*
                componentSegment.name = `create-${this.$options.name}`
                componentSegment.end()
                */
                //console.log(`${this.$options.name} component created`)
            }
        })
    }
}

/*
const recordOperationSegment = function (segment, scope) {
    const duration = segment.getDurationInMillis()
    const exclusive = segment.getExclusiveDurationInMillis()
    const transaction = segment.transaction
    createMetricPairs(transaction, segment.name, scope, duration, exclusive)
}
*/