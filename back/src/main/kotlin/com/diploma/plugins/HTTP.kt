package com.diploma.plugins

import io.ktor.http.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.application.*

// функция для настройки HTTP
fun Application.configureHTTP() {
    install(CORS) {
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.AccessControlAllowOrigin)
        allowSameOrigin = true
        allowCredentials = true
        allowNonSimpleContentTypes = true
        allowXHttpMethodOverride()
        //allowHeader("MyCustomHeader")
        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.

    }
}
