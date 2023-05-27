package com.diploma.data.task.datasource.local

import com.diploma.data.task.TaskEntity
import com.diploma.data.task.presets.listOfTasks
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.jdbc.JdbcConnectionImpl
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction

class LocalTaskDataSource(database: Database) : TaskDatabase {
    object Tasks : Table() {
        val id = integer("id").autoIncrement().uniqueIndex()
        val question = text("question")
        val answer = text("answer")
        val subjectName = text("subject_name").nullable()
        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            var neededToBeFilled = true
            exec("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_NAME = 'Tasks'") {rs ->
                if(rs.next()) neededToBeFilled = false
            }
            SchemaUtils.create(Tasks)
            if (neededToBeFilled) {
                listOfTasks().forEach { task ->
                    Tasks.insert {
                        it[question] = task.question
                        it[answer] = task.answer
                        it[subjectName] = task.subjectName
                    }
                }
            }
        }
    }

    override suspend fun saveTask(taskEntity: TaskEntity): Int = transaction {
        Tasks.insert {
            it[question] = taskEntity.question
            it[answer] = taskEntity.answer
            it[subjectName] = taskEntity.subjectName
        }[Tasks.id]
    }

    override suspend fun removeTask(id: Int): Boolean = transaction {
        Tasks.deleteWhere { Tasks.id eq id } > 0
    }

    override suspend fun getAllTasks(): List<TaskEntity> = transaction {
        Tasks.selectAll().mapToTasks()
    }

    override suspend fun searchTasks(query: String, page: Int, subjects: List<String>): List<TaskEntity> = transaction {
        // fetch next 20 tasks in tasks for passed subjects
//        Tasks.select {
//            (((Tasks.question like "%$query%")
//                    or (Tasks.answer like "%$query%"))
//                    and (Tasks.subjectName inList subjects))
//        }.limit(20, ((page - 1) * 20).toLong()).mapToTasks()

        Tasks.select {
            ((Tasks.question like "%$query%")
                    or (Tasks.answer like "%$query%"))
        }.mapToTasks()
    }

    private fun Query.mapToTasks() = this.map {
        TaskEntity(
            it[Tasks.id],
            it[Tasks.question],
            it[Tasks.answer],
            it[Tasks.subjectName]
        )
    }
}