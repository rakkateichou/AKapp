package com.diploma.data.favorite.datasource.local

import com.diploma.data.favorite.FavoriteEntity
import com.diploma.data.favorite.datasource.FavoriteDataSource
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

class LocalFavoriteDataSource(database: Database) : FavoriteDataSource {
    object Favorites : Table() {
        val id = integer("id")
        val userId = long("user_id")
        val question = text("question")
        val answer = text("answer")
        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.createMissingTablesAndColumns(Favorites)
        }
    }

    override suspend fun getFavorites(userId: Long): List<FavoriteEntity> = transaction {
        Favorites.select { Favorites.userId eq userId }.map {
            FavoriteEntity(
                it[Favorites.id],
                it[Favorites.userId],
                it[Favorites.question],
                it[Favorites.answer]
            )
        }
    }

    override suspend fun addFavorite(favorite: FavoriteEntity): Unit = transaction {
        Favorites.insert {
            it[this.id] = favorite.id
            it[this.userId] = favorite.userId
            it[this.question] = favorite.question
            it[this.answer] = favorite.answer
        }
    }

    override suspend fun removeFavorite(id: Int): Unit = transaction {
        Favorites.deleteWhere { Favorites.id eq id }
    }

    override suspend fun getNumOfFavoritesForTask(taskId: Int): Long = transaction {
        Favorites.select { Favorites.id eq taskId }.count()
    }

    override suspend fun isFavorite(userId: Long, taskId: Int): Boolean = transaction {
        Favorites.select { (Favorites.userId eq userId) and (Favorites.id eq taskId) }.count() > 0
    }

}