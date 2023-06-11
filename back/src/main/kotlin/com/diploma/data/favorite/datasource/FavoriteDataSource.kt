package com.diploma.data.favorite.datasource

import com.diploma.data.favorite.FavoriteEntity

interface FavoriteDataSource {
    suspend fun getFavorites(userId: Long): List<FavoriteEntity>
    suspend fun addFavorite(favorite: FavoriteEntity)
    suspend fun removeFavorite(userId: Long, taskId: Long)
    suspend fun getNumOfFavoritesForTask(taskId: Long): Long
    suspend fun isFavorite(userId: Long, taskId: Long): Boolean
}