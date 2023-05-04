package com.diploma.data.user.datasource.local

import com.diploma.data.user.User
import com.diploma.data.user.datasource.UserDataSource
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class LocalUserDataSource(database: Database) : UserDataSource {
    object Users : Table() {
        val id = long("id").autoIncrement().uniqueIndex()
        val name = text("name")
        val login = text("login").uniqueIndex()
        val password = text("password")
        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Users)
        }
    }

    override suspend fun register(user: User): Long = transaction {
        Users.insert {
            it[this.name] = user.name
            it[this.login] = user.login
            it[this.password] = user.password
        }[Users.id]
    }

    override suspend fun login(login: String, password: String): User? = transaction {
        val transaction = Users.select { (Users.login eq login) and (Users.password eq password)}.firstOrNull()
        if (transaction != null)
            User(
                transaction[Users.id],
                transaction[Users.login],
                transaction[Users.password],
                transaction[Users.name]
            )
        else null
    }

}