package com.diploma

import com.diploma.plugins.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*

fun main(args: Array<String>) = EngineMain.main(args)

@Suppress("unused")
fun Application.module() {
    configureHTTP()
    install(ContentNegotiation) { json() }
    val database = configureDatabase()
    //configureAuthentication(database)
    configureRouting(database)
    configureMonitoring(database)
}

fun isDev() = System.getenv("DEV")?.isNotEmpty() ?: false
//fun isDev() = true