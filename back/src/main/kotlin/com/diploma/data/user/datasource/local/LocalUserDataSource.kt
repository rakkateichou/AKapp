package com.diploma.data.user.datasource.local

import com.diploma.data.user.User
import com.diploma.data.user.datasource.UserDataSource
import com.diploma.util.AESEncryption
import org.h2.security.AES
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import javax.crypto.Cipher

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
        val idOfEx = Users.select { Users.login eq user.login }.firstOrNull()?.get(Users.id) ?: -1
        if (idOfEx != -1L) return@transaction -1
        val up = AESEncryption.encrypt(user.password)?: run { print("error while registering"); return@transaction -1 }
        Users.insert {
            it[this.name] = user.name
            it[this.login] = user.login
            it[this.password] = up
        }[Users.id]
    }

    override suspend fun login(login: String, password: String): User? = transaction {
        val encryptedPassword = AESEncryption.encrypt(password)?: return@transaction null
        val transaction = Users.select { (Users.login eq login) and (Users.password eq encryptedPassword)}.firstOrNull()
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