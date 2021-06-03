const newrelic = require('newrelic')
const util = require('util')
const path = require('path')
const deepMerge = require('deepmerge')
const logger = require('consola').withScope('nuxt:newrelic')
const { requestHandler, errorHandler } = require('./serverHandlers')

module.exports = function newrelicModule(moduleOptions) {
    const defaults = {
        disabled: process.env.NEWRELIC_DISABLED || false,
        disableClientSide: process.env.NEWRELIC_DISABLE_CLIENT_SIDE || false,
        disableServerSide: process.env.NEWRELIC_DISABLE_SERVER_SIDE || false,
    }
    const { nuxt } = this
    const options = deepMerge.all([defaults, moduleOptions])

    if (options.disabled) {
        return
    }

    /*
    if (!options.disableClientSide) {
        this.addPlugin({
            src: path.resolve(__dirname, './newrelic.client.js'),
            fileName: 'newrelic/plugin.client.js',
            mode: "client"
        })
    }
    */

    if (!options.disableServerSide) {
        /*
        this.addPlugin({
            src: path.resolve(__dirname, './newrelic.server.js'),
            fileName: 'newrelic/plugin.server.js',
            mode: "server"
        })
        */

        this.nuxt.hook('render:setupMiddleware', app => app.use(requestHandler()))

        this.nuxt.hook('render:errorMiddleware', app => app.use(errorHandler()))

        this.nuxt.hook('generate:routeFailed', ({ route, errors }) => {
            errors.forEach(({ error }) => {
                newrelic.noticeError(error, { 'url': route.path, 'route': route.name ?? "anonymous" })
            })
        })
        
        this.nuxt.hook('render:route', (url, result, context) => {
            //TODO: inject newrelic browser script

            let txName = context?.route?.name
            if (txName) {
                newrelic.setTransactionName(txName)
            } else {
                //console.log(context?.route?.matched[0]?.path)
                //let pageRouterPath = context?.route?.matched[0]?.path
                //do nothing
            }
        })
    }
}

module.exports.meta = require('../package.json')