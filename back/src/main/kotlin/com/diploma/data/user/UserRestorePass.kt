package com.diploma.data.user

import kotlinx.serialization.Serializable

@Serializable
data class UserRestorePass(
    val login: String,
    val code: String,
    val password: String
)