package com.diploma.plugins

import com.diploma.data.task.TaskEntity
import com.diploma.data.task.datasource.local.LocalTaskDataSource
import com.diploma.data.task.datasource.web.WebTaskDataSource
import com.diploma.data.task.datasource.web.parsers.Mailru
import com.diploma.data.task.datasource.web.parsers.Sdamgia
import com.diploma.data.task.datasource.web.parsers.WebTaskParser
import com.diploma.data.task.datasource.web.parsers.Znanija
import com.diploma.data.user.User
import com.diploma.data.user.UserCreds
import com.diploma.data.user.datasource.local.LocalUserDataSource
import io.ktor.http.*
import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import org.jetbrains.exposed.sql.Database

fun Application.configureRouting(database: Database) {
    val webSourceList = arrayOf(
        Sdamgia(),
//        Mailru(),
//        Znanija()
    )

    val localSource = LocalTaskDataSource(database)
    val webSource = WebTaskDataSource(*webSourceList)
    val userSource = LocalUserDataSource(database)
    routing {
        get("/local") {
            val query = call.request.queryParameters["query"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val page = call.request.queryParameters["page"]?.toInt() ?: 1
            val subjects = call.request.queryParameters.getAll("subjects")?: listOf()
            val tasks = localSource.searchTasks(query, page, subjects)
            call.respond(HttpStatusCode.OK, tasks)
        }
        get("/local/all") {
            val tasks = localSource.getAllTasks()
            call.respond(HttpStatusCode.OK, tasks)
        }
        put("/local") {
            val task = call.receive<TaskEntity>()
            localSource.saveTask(task)
            call.respond(HttpStatusCode.Created)
        }
        delete("/local/{id}") {
            val id = call.parameters["id"]?.toInt()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            localSource.removeTask(id)
            call.respond(HttpStatusCode.OK)
        }

        get("/int") {
            val query = call.request.queryParameters["query"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val page = call.request.queryParameters["page"]?.toInt() ?: 1
            var subjects = call.request.queryParameters.getAll("subjects")?: listOf()
            subjects = subjects.filter { it != "" }
            print(subjects)
            val tasks = webSource.searchTasks(query, page, subjects)
            call.respond(HttpStatusCode.OK, tasks)
        }

        put("/user") {
            val user = call.receive<User>()
            println(user)
            val id = userSource.register(user)
            print(id)
            call.respond(HttpStatusCode.OK, id)
        }

        post("/user") {
            val creds = call.receive<UserCreds>();
            val user = userSource.login(creds.login, creds.password)
            if (user != null) {
                call.respond(HttpStatusCode.OK, user)
            } else {
                call.respond(HttpStatusCode.BadRequest, "Неверный логин или пароль")
            }
        }

//        get("/profile") {
//            val user = call.principal<UserIdPrincipal>() ?: return@get call.respond(HttpStatusCode.BadRequest)
//            call.respond(HttpStatusCode.OK, user.name)
//        }
    }
}
