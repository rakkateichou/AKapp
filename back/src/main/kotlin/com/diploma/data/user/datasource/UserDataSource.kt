package com.diploma.data.user.datasource

import com.diploma.data.user.User

interface UserDataSource {
    suspend fun register(user: User): User?
    suspend fun login(login: String, password: String): User?
    suspend fun changePassword(login: String, oldPassword: String, newPassword: String): Boolean
    suspend fun generateRestoreCode(login: String)
    suspend fun restorePassword(login: String, code: String, password: String): Boolean

    suspend fun isUserOk(user: User): Boolean
    suspend fun updateUser(user: User): Boolean
}