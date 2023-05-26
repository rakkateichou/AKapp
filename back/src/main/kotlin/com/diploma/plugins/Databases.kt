package com.diploma.plugins

import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import kotlin.system.exitProcess

fun Application.configureDatabase(): Database =
    try {
     Database.connect(
        url = "jdbc:mysql://mysql:3306/taskdb",
        user = "root",
        driver = "com.mysql.cj.jdbc.Driver",
        password = "1234"
    )
    } catch (e: Exception) {
        log.error("Видимо MYSQL сервер ещё не запущен. Для первого запуска его установка может занять до 5 минут.")
        exitProcess(1)
        (null as Database)
    }