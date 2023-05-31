package com.diploma.plugins

import com.diploma.data.SecureFavorite
import com.diploma.data.favorite.datasource.local.LocalFavoriteDataSource
import com.diploma.data.task.TaskEntity
import com.diploma.data.task.TaskResponse
import com.diploma.data.task.datasource.local.LocalTaskDataSource
import com.diploma.data.task.datasource.web.WebTaskDataSource
import com.diploma.data.task.datasource.web.parsers.Sdamgia
import com.diploma.data.task.datasource.web.parsers.SdamgiaSelenium
import com.diploma.data.user.User
import com.diploma.data.user.UserCreds
import com.diploma.data.user.UserKnownNewPass
import com.diploma.data.user.UserRestorePass
import com.diploma.data.user.datasource.local.LocalUserDataSource
import com.diploma.util.AESEncryption
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.jetbrains.exposed.sql.Database
import java.io.File

fun Application.configureRouting(database: Database) {
    val webSourceList = arrayOf(
        Pair(Sdamgia(), SdamgiaSelenium())
//        Mailru(),
//        Znanija()
    )

    val localSource = LocalTaskDataSource(database)
    val webSource = WebTaskDataSource(*webSourceList)
    val userSource = LocalUserDataSource(database)
    val favoriteSource = LocalFavoriteDataSource(database)

    routing {
        get("/local") {
            val query = call.request.queryParameters["query"] ?: ""
            val page = call.request.queryParameters["page"]?.toInt() ?: 1
            val subjects = call.request.queryParameters.getAll("subjects")?: listOf()
            val userId = call.request.queryParameters["userId"]?.toLong() ?: -1 // todo not safe
            val tasks = localSource.searchTasks(query, page, subjects)
            val response = tasks.map { task ->
                if (userId == -1L) return@map TaskResponse(task, false, 0)
                val isFavorite = favoriteSource.isFavorite(userId, task.id)
                val favoriteCount = favoriteSource.getNumOfFavoritesForTask(task.id)
                TaskResponse(task, isFavorite, favoriteCount)
            }
            call.respond(HttpStatusCode.OK, response)
        }
        put("/local") {
            val task = call.receive<TaskEntity>()
            print(task)
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
            println(query)
            val page = call.request.queryParameters["page"]?.toInt() ?: 1
            var subjects = call.request.queryParameters.getAll("subjects")?: listOf()
            val userId = call.request.queryParameters["userId"]?.toLong() ?: -1
            subjects = subjects.filter { it != "" }
            print(subjects)
            val tasks = webSource.searchTasks(query, page, subjects)
            val response = tasks.map { task ->
                if (userId == -1L) return@map TaskResponse(task, false, 0)
                val isFavorite = favoriteSource.isFavorite(userId, task.id)
                val favoriteCount = favoriteSource.getNumOfFavoritesForTask(task.id)
                TaskResponse(task, isFavorite, favoriteCount)
            }
            call.respond(HttpStatusCode.OK, response)
        }

        put("/user") {
            val user = call.receive<User>()
            println(user)
            val registeredUser = userSource.register(user)
            if (registeredUser == null) {
                call.respond(HttpStatusCode.BadRequest, "Пользователь с таким логином уже существует")
                return@put
            }
            call.respond(HttpStatusCode.OK, registeredUser)
        }

        put("/user/{login}/new-pass") {
            val login = call.parameters["login"] ?: return@put call.respond(HttpStatusCode.BadRequest)
            val unp = call.receive<UserKnownNewPass>()
            val isPasswordChanged = userSource.changePassword(login, unp.oldPassword, unp.newPassword)
            if (isPasswordChanged) {
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.BadRequest, "Неверный логин или пароль")
            }
        }

        static("/users") {
            staticRootFolder = File(System.getProperty("user.dir"))
            files("users")
        }
        put("/user/{login}/avatar") {
            val login = call.parameters["login"] ?: return@put call.respond(HttpStatusCode.BadRequest)
            // получение файла
            val multipart = call.receiveMultipart()
            multipart.forEachPart { part ->
                if (part is PartData.FileItem) {
                    if (!part.contentType?.contentType?.startsWith("image")!!) {
                        call.respond(HttpStatusCode.BadRequest, "Неверный формат файла")
                        return@forEachPart
                    }
                    
                    val file = File(System.getProperty("user.dir") + "/users/" + login + "/avatar.png")
                    file.parentFile.mkdirs()
                    print(file.absolutePath)
                    part.streamProvider().use { input ->
                        file.outputStream().buffered().use { output ->
                            input.copyTo(output)
                        }
                    }
                }
                part.dispose()
            }
            call.respond(HttpStatusCode.OK)
        }

        put("/user/{login}/update") {
            val login = call.parameters["login"] ?: return@put call.respond(HttpStatusCode.BadRequest)
            val user = call.receive<User>()
            val isUpdated = userSource.updateUser(user)
            if (isUpdated)
                call.respond(HttpStatusCode.OK)
            else
                call.respond(HttpStatusCode.BadRequest, "Неверный логин")
        }

        post("/user/{login}/data") {
            val login = call.parameters["login"] ?: return@post call.respond(HttpStatusCode.BadRequest)
            val password = call.receive<String>()
            val decryptedPassword = AESEncryption.decrypt(password) ?: return@post call.respond(HttpStatusCode.BadRequest)
            val user = userSource.login(login, decryptedPassword)
            if (user != null) {
                call.respond(HttpStatusCode.OK, user)
            } else {
                call.respond(HttpStatusCode.BadRequest, "Неверный логин или пароль")
            }
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

        post("/user/restore/code") {
            val login = call.receive<String>()
            userSource.generateRestoreCode(login)
            call.respond(HttpStatusCode.OK)
        }

        post("/user/restore") {
            val data = call.receive<UserRestorePass>()
            val isOk = userSource.restorePassword(data.login, data.code, data.password)
            if (isOk) {
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.BadRequest, "Неверный код")
            }
        }

        put("/favorite") {
            val fav = call.receive<SecureFavorite>()
            val isUserOk = userSource.isUserOk(fav.user)
            if (!isUserOk) {
                call.respond(HttpStatusCode.BadRequest, "Неверный логин")
                return@put
            }
            favoriteSource.addFavorite(fav.favorite)
            call.respond(HttpStatusCode.OK)
        }

        post("/favorites") {
            val user = call.receive<User>()
            val isUserOk = userSource.isUserOk(user)
            if (!isUserOk) {
                call.respond(HttpStatusCode.BadRequest, "Неверный логин")
                return@post
            }
            val favorites = favoriteSource.getFavorites(user.id)
            call.respond(HttpStatusCode.OK, favorites)
        }

        delete("/favorite/{id}") {
            val user = call.receive<User>()
            val isUserOk = userSource.isUserOk(user)
            if (!isUserOk) {
                call.respond(HttpStatusCode.BadRequest, "Неверный логин")
                return@delete
            }
            val id = call.parameters["id"]?.toInt() ?: return@delete call.respond(HttpStatusCode.BadRequest)
            favoriteSource.removeFavorite(id)
            call.respond(HttpStatusCode.OK)
        }
    }
}
