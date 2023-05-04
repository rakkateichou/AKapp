package com.diploma.data.user

import kotlinx.serialization.Serializable

@Serializable
data class UserCreds(
    val login: String,
    val password: String,
)