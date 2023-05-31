package com.diploma.data

import com.diploma.data.favorite.FavoriteEntity
import com.diploma.data.user.User

// дата класс для избранного пользователя
@kotlinx.serialization.Serializable
data class SecureFavorite(
    val user: User,
    val favorite: FavoriteEntity
)
