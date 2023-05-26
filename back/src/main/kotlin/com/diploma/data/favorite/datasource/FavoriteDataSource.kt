package com.diploma.data.favorite.datasource

import com.diploma.data.favorite.FavoriteEntity

interface FavoriteDataSource {
    suspend fun getFavorites(userId: Long): List<FavoriteEntity>
    suspend fun addFavorite(favorite: FavoriteEntity)
    suspend fun removeFavorite(id: Int)
}