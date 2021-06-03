import Vue from 'vue'

export default function (context, inject) {
    context.app.router.beforeEach((to, from, next) => {
        next()
    })
    context.app.router.afterEach((to, from) => {
    })

}