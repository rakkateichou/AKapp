package com.diploma.plugins

import com.diploma.data.user.datasource.local.LocalUserDataSource
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import org.jetbrains.exposed.sql.Database

// функция для настройки аутентификации
fun Application.configureAuthentication(database: Database) {
    install(Authentication) {
        form("auth") {
            val userSource = LocalUserDataSource(database)
            userParamName = "login"
            passwordParamName = "password"
            validate {
                val user = userSource.login(it.name, it.password)
                if (user != null) {
                    UserIdPrincipal(it.name)
                } else {
                    null
                }
            }
            challenge {
                call.respond(HttpStatusCode.Unauthorized, "Логин или пароль неверны")
            }
        }
    }
}