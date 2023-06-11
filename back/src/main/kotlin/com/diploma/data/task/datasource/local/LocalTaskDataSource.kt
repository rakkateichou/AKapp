package com.diploma.data.task.datasource.local

import com.diploma.data.task.TaskEntity
import com.diploma.data.task.presets.listOfTasks
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.jdbc.JdbcConnectionImpl
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import kotlin.system.exitProcess

// имплементация интерфейса TaskDataSource для работы с локальной базой данных задач
class LocalTaskDataSource(database: Database) : TaskDatabase {
    companion object {
        const val LOCAL_TASK_ID_PREFIX = -1000000
    }
    object Tasks : Table() {
        val id = long("id").autoIncrement().uniqueIndex()
        val question = text("question")
        val answer = text("answer")
        val subjectName = text("subject_name").nullable()
        override val primaryKey = PrimaryKey(id)
    }

    // инициализация таблицы задач
    init {
        transaction(database) {
            // проверка, нужно ли заполнять таблицу задач
            var neededToBeFilled = true
            try {
                exec("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_NAME = 'Tasks'") { rs ->
                    if (rs.next()) neededToBeFilled = false
                }
            } catch (e: Exception) {
                throw RuntimeException("Попытка подключения провалилась. Сервер MYSQL ещё не запущен")
            }
            // создание таблицы задач
            SchemaUtils.createMissingTablesAndColumns(Tasks)
            // заполнение таблицы задач
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

    // сохранение задачи в таблицу задач
    override suspend fun saveTask(taskEntity: TaskEntity): Long = transaction {
        Tasks.insert {
            it[question] = taskEntity.question
            it[answer] = taskEntity.answer
            it[subjectName] = taskEntity.subjectName
        }[Tasks.id] + LOCAL_TASK_ID_PREFIX
    }

    // удаление задачи из таблицы задач по id
    override suspend fun removeTask(id: Long): Boolean = transaction {
        val id = id - LOCAL_TASK_ID_PREFIX
        Tasks.deleteWhere { Tasks.id eq id } > 0
    }

    // поиск задач по запросу, странице и предметам
    override suspend fun searchTasks(query: String, page: Int, subjects: List<String>): List<TaskEntity> = transaction {
        // fetch next 20 tasks in tasks for passed subjects
//        Tasks.select {
//            (((Tasks.question like "%$query%")
//                    or (Tasks.answer like "%$query%"))
//                    and (Tasks.subjectName inList subjects))
//        }.limit(20, ((page - 1) * 20).toLong()).mapToTasks()
        // if query is empty then return all tasks
//        if (query.isEmpty()) {
//            Tasks.select {
//                (Tasks.subjectName inList subjects)
//            }.limit(20, ((page - 1) * 20).toLong()).mapToTasks()
//        } else {
//            Tasks.select {
//                (((Tasks.question like "%$query%")
//                        or (Tasks.answer like "%$query%"))
//                        and (Tasks.subjectName inList subjects))
//            }.limit(20, ((page - 1) * 20).toLong()).mapToTasks()
//        }
        if (query.isEmpty()) {
            Tasks.selectAll().mapToTasks()
        }
        else {
            Tasks.select {
                ((Tasks.question like "%$query%")
                        or (Tasks.answer like "%$query%"))
            }.mapToTasks()
        }
    }

    // конвертация запроса в список задач
    private fun Query.mapToTasks() = this.map {
        TaskEntity(
            it[Tasks.id] + LOCAL_TASK_ID_PREFIX,
            it[Tasks.question],
            it[Tasks.answer],
            it[Tasks.subjectName]
        )
    }
}