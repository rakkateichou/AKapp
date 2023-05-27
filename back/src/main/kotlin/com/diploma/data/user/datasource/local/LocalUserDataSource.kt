package com.diploma.data.user.datasource.local

import com.diploma.data.user.User
import com.diploma.data.user.datasource.UserDataSource
import com.diploma.isDev
import com.diploma.util.AESEncryption
import jakarta.mail.internet.InternetAddress
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.simplejavamail.api.mailer.Mailer
import org.simplejavamail.email.EmailBuilder
import org.simplejavamail.mailer.MailerBuilder


class LocalUserDataSource(database: Database) : UserDataSource {
    object Users : Table() {
        val id = long("id").autoIncrement()
        val name = text("name")
        val login = varchar("login", 50).uniqueIndex()
        val password = text("password")
        val email = text("email")
        val info = text("info")
        val restoreCode = text("restore_code")  //.default('') lol it can't have default value
        override val primaryKey = PrimaryKey(id)
    }

    var mailerBuilder = MailerBuilder
        .withSMTPServer("smtp.yandex.ru", 465, "sotvetis.project", "bddbyuawimtnzfpz")//""wokktvxkaqxkvpty") //"XK_Z4\"#Tf!TL^cm"
        .withDebugLogging(isDev())
        .withProperty("mail.smtp.auth", "true")
        .withProperty("mail.smtp.starttls.enable", "true")
        .withProperty("mail.smtp.ssl.enable", "true")
        .withProperty("mail.smtp.quitwait", "false")
        .withProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory")
    var mailer: Mailer

    init {
        transaction(database) {
            SchemaUtils.create(Users)
        }
        mailer = mailerBuilder.buildMailer()
    }

    override suspend fun register(user: User): User? = transaction {
        val idOfEx = Users.select { Users.login eq user.login }.firstOrNull()?.get(Users.id) ?: -1
        if (idOfEx != -1L) return@transaction null
        val up = AESEncryption.encrypt(user.password) ?: run { print("error while registering"); return@transaction null }
        Users.insert {
            it[this.name] = user.name
            it[this.login] = user.login
            it[this.password] = up
            it[this.email] = user.email
            it[this.info] = "Пользователь системы SOTVETIS" // default info
            it[this.restoreCode] = "" // it's default value. it is here lol
        }
        return@transaction User(
            Users.select { Users.login eq user.login }.first()[Users.id],
            user.login,
            up,
            user.email,
            user.name,
            user.info
        )
    }

    override suspend fun login(login: String, password: String): User? = transaction {
        val encryptedPassword = AESEncryption.encrypt(password) ?: return@transaction null
        val transaction =
            Users.select { (Users.login eq login) and (Users.password eq encryptedPassword) }.firstOrNull()
        if (transaction != null)
            User(
                transaction[Users.id],
                transaction[Users.login],
                transaction[Users.password],
                transaction[Users.email],
                transaction[Users.name],
                info = transaction[Users.info]
            )
        else null
    }

    override suspend fun changePassword(login: String, oldPassword: String, newPassword: String): Boolean =
        transaction {
            val encryptedOldPassword = AESEncryption.encrypt(oldPassword) ?: return@transaction false
            val encryptedNewPassword = AESEncryption.encrypt(newPassword) ?: return@transaction false
            val transaction =
                Users.select { (Users.login eq login) and (Users.password eq encryptedOldPassword) }.firstOrNull()
            if (transaction != null) {
                Users.update({ Users.login eq login }) {
                    it[password] = encryptedNewPassword
                }
                true
            } else false
        }

    override suspend fun generateRestoreCode(login: String) = transaction {
        // get user email
        val email = Users.select { Users.login eq login }.firstOrNull()?.get(Users.email) ?: return@transaction
        // generate code of six letters and numbers
        val code = (1..6).map { (('a'..'z') + ('A'..'Z') + ('0'..'9')).random() }.joinToString("")
        // send code to email

        val mail = EmailBuilder.startingBlank()
            .to(InternetAddress(email))
            .from(InternetAddress("sotvetis.project@yandex.ru"))
            .withSubject("Восстановление пароля SOTVETIS")
            .withPlainText("Ваш код для восстановления пароля: $code")
            .buildEmail()
        mailer.sendMail(mail)
        // save code to database
        Users.update({ Users.login eq login }) {
            it[restoreCode] = code
        }

    }

    override suspend fun restorePassword(login: String, code: String, password: String): Boolean = transaction {
        if (code.length != 6) return@transaction false
        // check if code is correct
        val transaction = Users.select { (Users.login eq login) and (Users.restoreCode eq code) }.firstOrNull()
        if (transaction != null) {
            // change password
            val encryptedPassword = AESEncryption.encrypt(password) ?: return@transaction false
            Users.update({ Users.login eq login }) {
                it[Users.password] = encryptedPassword
            }
            // clear restore code
            Users.update({ Users.login eq login }) {
                it[Users.restoreCode] = ""
            }
            true
        } else false
    }

    override suspend fun isUserOk(user: User): Boolean = transaction {
        val transaction = Users.select { (Users.id eq user.id) and (Users.login eq user.login) and (Users.password eq user.password) }.firstOrNull()
        return@transaction transaction != null
    }

    override suspend fun updateUser(user: User): Boolean {
        // update user info
        val update = transaction {
            Users.update({ Users.id eq user.id }) {
                it[login] = user.login
                it[name] = user.name
                it[email] = user.email
                it[info] = user.info
            }
        }
        return update > 0
    }

}