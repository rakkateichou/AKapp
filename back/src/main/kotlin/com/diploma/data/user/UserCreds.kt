package com.diploma.data.user

import kotlinx.serialization.Serializable

// дата класс для данных пользователя
@Serializable
data class UserCreds(
    val login: String,
    val password: String,
)