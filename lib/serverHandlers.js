const newrelic = require('newrelic')
const util = require('util')
const logger = require('consola').withScope('nuxt:newrelic')

const requestHandler = () => (req, res, next) => {
    //logger.info("invoking request handler for req- " + req.url)
    //newrelic.setTransactionName(req.url)

    next()
}

const errorHandler = () => (error, req, res, next) => {
    const e = new Error(error)
    e.stack = error.stack
    newrelic.noticeError(e)
    next(error)
}

module.exports = {
    requestHandler,
    errorHandler
}