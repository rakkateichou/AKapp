package com.diploma.data.user

import kotlinx.serialization.Serializable

// дата класс для пользователя
@Serializable
data class User(
    val id: Long = -1,
    val login: String,
    val password: String,
    val email: String,
    val name: String,
    val info: String = "",
    val restoreCode: String = ""
)