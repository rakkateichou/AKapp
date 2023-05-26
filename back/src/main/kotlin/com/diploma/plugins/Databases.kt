package com.diploma.plugins

import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database

fun Application.configureDatabase(): Database =
    Database.connect(
        url = "jdbc:mysql://mysql:3306/taskdb",
        user = "root",
        driver = "com.mysql.cj.jdbc.Driver",
        password = "1234"
    )