package com.diploma.data.favorite.datasource.local

import com.diploma.data.favorite.FavoriteEntity
import com.diploma.data.favorite.datasource.FavoriteDataSource
import com.diploma.data.task.datasource.local.LocalTaskDataSource
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

// имплементация интерфейса FavoriteDataSource для работы с локальной базой данных избранных задач
class LocalFavoriteDataSource(database: Database) : FavoriteDataSource {
    object Favorites : Table() {
        val id = integer("id").autoIncrement().uniqueIndex()
        val taskId = integer("task_id")
        val userId = long("user_id")
        val question = text("question")
        val answer = text("answer")
        override val primaryKey = PrimaryKey(LocalTaskDataSource.Tasks.id)
    }

    // инициализация таблицы избранных задач
    init {
        transaction(database) {
            SchemaUtils.createMissingTablesAndColumns(Favorites)
        }
    }

    // получение списка избранных задач для пользователя
    override suspend fun getFavorites(userId: Long): List<FavoriteEntity> = transaction {
        Favorites.select { Favorites.userId eq userId }.map {
            FavoriteEntity(
                it[Favorites.taskId],
                it[Favorites.userId],
                it[Favorites.question],
                it[Favorites.answer]
            )
        }
    }

    // добавление задачи в список избранных
    override suspend fun addFavorite(favorite: FavoriteEntity): Unit = transaction {
        Favorites.insert {
            it[this.taskId] = favorite.id
            it[this.userId] = favorite.userId
            it[this.question] = favorite.question
            it[this.answer] = favorite.answer
        }
    }

    // удаление задачи из списка избранных
    override suspend fun removeFavorite(userId: Long, taskId: Int): Unit = transaction {
        Favorites.deleteWhere { (Favorites.userId eq userId) and (Favorites.taskId eq taskId)}
    }

    // получение количества избранных задач для задачи
    override suspend fun getNumOfFavoritesForTask(taskId: Int): Long = transaction {
        Favorites.select { Favorites.taskId eq taskId }.count()
    }

    // проверка, является ли задача избранной для пользователя
    override suspend fun isFavorite(userId: Long, taskId: Int): Boolean = transaction {
        Favorites.select { (Favorites.userId eq userId) and (Favorites.taskId eq taskId) }.count() > 0
    }

}