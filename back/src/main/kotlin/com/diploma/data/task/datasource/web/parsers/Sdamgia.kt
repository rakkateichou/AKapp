package com.diploma.data.task.datasource.web.parsers

import com.diploma.data.task.TaskEntity
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import java.util.*
import java.util.regex.Pattern
import kotlin.math.ceil

class Sdamgia : WebTaskParser {

    companion object {
        //val PROXY = "https://proxy.scrapeops.io/v1/?api_key=4eceb291-1660-4500-986a-61d2a1b042d0&url="

        // список доменов для поиска
        val SUBJECT_DOMAINS = listOf(
            "mathb-ege", "ege", "inf-ege", "rus-ege", "en-ege", "phys-ege",
            "chem-ege", "bio-ege", "geo-ege", "soc-ege", "lit-ege", "hist-ege",
            "de-ege", "fr-ege"
        )

        // список url для поиска
        val URLS = SUBJECT_DOMAINS.map { "https://$it.sdamgia.ru/search" }
        val GOOGLE = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCsgJe5nSDp3985F8DwNy43_o8eMEeKySM&cx=56fb9f2b47c6d416b&q="
        // список соединений
        val CONNECTIONS = URLS.map {
            Jsoup.connect(it)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.4567.89 Safari/537.36")
                .data("cb", "1") // только в условии
                .data("body", "3")
        }

        // список названий предметов
        val SUBJECT_NAMES = listOf(
            "Математика базового уровня", "Математика профильного уровня",
            "Информатика", "Русский язык",
            "Английский язык", "Физика",
            "Химия", "Биология",
            "География", "Обществознание",
            "Литература", "История",
            "Немецкий язык", "Французский язык"
        )
    }

    val pageSize: Int = 20
    val numPattern = Pattern.compile("\\d+")

    // получение список предметов
    override fun getSubjectList(): List<String> = SUBJECT_NAMES
    // поиск задач
    override suspend fun searchTasks(query: String, page: Int, subjects: List<String>): List<TaskEntity> {
        val subjects = subjects.toMutableList()
        if (subjects.isEmpty()) {
            for (connection in CONNECTIONS) {
                val doc: Document = try {
                    connection.maxBodySize(1024 * 80).data("search", query).get()
                } catch (e: Exception) {
                    println(e.localizedMessage)
                    print("Возможно отсутствует досуп к интернету")
                    throw RuntimeException("Попытка обратиться к fallback движку")
                }

                val divTextWithNumEl = doc.select("div:contains(Всего)").first()
                val divTextWithNum = divTextWithNumEl?.text()
                val indexOfTotal = divTextWithNum?.indexOf("Всего:") ?: 0
                val totalTasksText = divTextWithNum?.substring(indexOfTotal, indexOfTotal + 100) ?: continue
                val totalTasksNum = numPattern.matcher(totalTasksText).results().findFirst().get().group().toInt()
                val numOfPages = ceil(totalTasksNum / pageSize.toFloat()).toInt()
                if (numOfPages > 2)
                    subjects.add(SUBJECT_NAMES[CONNECTIONS.indexOf(connection)])
            }
        }

        val results = arrayListOf<TaskEntity>()
        for (subject in subjects) {
            val url = URLS[SUBJECT_NAMES.indexOf(subject)]
            val doc: Document = try {
                Jsoup.connect(url)
                    .data("search", query)
                    .data("cb", "1") // только в условии
                    .data("body", "3")
                    .data("page", "$page")
                    .get()
            } catch (e: Exception) {
                print(e.message)
                return Collections.emptyList();
            }

            val tasksOnThisPage = doc.select("div[class=prob_maindiv]")
            for (task in tasksOnThisPage) {
                var id = 0L
                for (iElement in task.select("span[class=prob_nums]").select("a")) {
                    id = iElement.text()?.toLong() ?: 0
                }

                val questionBuilder = StringBuilder()
                for (qElement in task.select("div[class=pbody]").select("p")) {
                    questionBuilder.append(stringFromHtml(qElement.outerHtml())).append("\n");
                }
                val questionBuilderStr = questionBuilder.toString().trim()

                // less strict search
                var flag = true
                query.split(" ").forEach { if (it.substring(0, it.length-(it.length/4)) in questionBuilderStr) flag = false }
                if (flag) continue

                val question = questionBuilderStr.replace("&nbsp;", " ");

                val answerBuilder = StringBuilder()
                for (aElement in task.select("div[class=solution]").select("p")) {
                    answerBuilder.append(stringFromHtml(aElement.outerHtml())).append("\n");
                }
                val answer = answerBuilder.toString().trim().replace("&nbsp;", " ").replace("\n\n", "\n");

                results.add(TaskEntity(id, question, answer, subject));
            }
        }
        return results.toList()
    }

    var pattern = Pattern.compile(">([^<>]+?)<|alt=\"(.*?)\"", Pattern.DOTALL)

    private fun stringFromHtml(html: String): String? {
        val builder = StringBuilder()
        val questionMatcher = pattern.matcher(html)
        while (questionMatcher.find()) {
            for (j in 1..questionMatcher.groupCount()) {
                val gr = questionMatcher.group(j) ?: continue
                builder.append(gr)
            }
        }
        return builder.toString().trim { it <= ' ' }
    }

    private fun googleSearch(q: String) {println(GOOGLE)}
//    override suspend fun searchTasks(query: String, page: Int, subjects: ArrayList<String>): List<TaskEntity> {
//        if (subjects.isEmpty()) {
//            for (url in URLS) {
//                val doc: Document = try {
//                    Jsoup.connect(url)
//                        .data("search", query)
//                        .data("cb", "1") // только в условии
//                        .data("body", "3")
//                        .get()
//                } catch (e: Exception) {
//                    throw RuntimeException("Отсутствует интернет!")
//                }
//
//                val divTextWithNumEl = doc.select("div:contains(Всего)").first()
//                val divTextWithNum = divTextWithNumEl?.text()
//                val totalTasksText = divTextWithNum?.substring(divTextWithNum.indexOf("Всего:"))
//                val totalTasksNum = Scanner(totalTasksText).useDelimiter("\\D+").nextInt()
//                val numOfPages = ceil((totalTasksNum / pageSize.toFloat()).toDouble()).toInt()
//                if (numOfPages > 2) subjects.add(SUBJECT_NAMES[URLS.indexOf(url)])
//            }
//        }
//
//        for (subject in subjects){
//            val url = URLS[SUBJECT_NAMES.indexOf(subject)]
//            val doc: Document = try{
//                Jsoup.connect(url)
//                    .data("search", query)
//                    .data("cb", "1") // только в условии
//                    .data("body", "3")
//                    .data("page", "$page")
//                    .get()
//                } catch (e: Exception) {
//                    return Collections.emptyList();
//                }
//
//                var tasksOnThisPage = doc.select("div[class=prob_maindiv]")
//                for (task in tasksOnThisPage) {
//                    var subjectName = URL_TO_SUBJECT_NAME.get(url);
//
//                    StringBuilder questionBuilder = new StringBuilder();
//                    for (Element qElement : task.select("div[class=pbody]").select("p")) {
//                        questionBuilder.append(stringFromHtml(qElement.outerHtml())).append("\n");
//                    }
//                    String question = questionBuilder.toString().trim().replaceAll("&nbsp;", " ");
//
//                    StringBuilder answerBuilder = new StringBuilder();
//                    for (Element aElement : task.select("div[class=solution]").select("p")) {
//                        answerBuilder.append(stringFromHtml(aElement.outerHtml())).append("\n");
//                    }
//                    String answer = answerBuilder.toString().trim().replaceAll("&nbsp;", " ");
//
//                    results.add(new TaskEntity(id.get(), question, answer, subjectName));
//                    id.getAndIncrement();
//                }
//        }
//    }


//    fun generateQueryOverview(query: String?): QueryOverview? {
//        val subjectsWithNumbersOfPages = Collections.synchronizedMap(HashMap<String, Int>())
//        val topSubjectsNP: MutableMap<String, Int> = HashMap()
//        val futures: MutableList<Future<*>> = LinkedList()
//        val qo = QueryOverview()
//        qo.setQuery(query)
//        for (url in com.project.index.kolchanov.repository.TaskRepositorySdamgia.URLS) {
//            futures.add(com.project.index.kolchanov.repository.TaskRepositorySdamgia.executor.submit(Runnable {
//                val doc: Document
//                doc = try {
//                    Jsoup.connect(url)
//                        .data("search", query)
//                        .data("cb", "1") // только в условии
//                        .data("body", "3")
//                        .get()
//                } catch (e: IOException) {
//                    throw RuntimeException("Отсутствует интернет!")
//                }
//                val subjectDomain: String =
//                    com.project.index.kolchanov.repository.TaskRepositorySdamgia.URL_TO_SUBJECT_NAME.get(url)
//                val divTextWithNumEl = doc.select("div:contains(Всего)").first() ?: return@submit
//                val divTextWithNum = divTextWithNumEl.text()
//                val totalTasksText = divTextWithNum.substring(divTextWithNum.indexOf("Всего:"))
//                val totalTasksNum = Scanner(totalTasksText).useDelimiter("\\D+").nextInt()
//                val numOfPages = Math.ceil((totalTasksNum / 20f).toDouble()).toInt()
//                subjectsWithNumbersOfPages[subjectDomain] = numOfPages
//            }))
//        }
//        for (future in futures) {
//            try {
//                future.get()
//            } catch (thrown: Throwable) {
//                System.err.println(thrown.message)
//            }
//        }
//        qo.setSubjects(subjectsWithNumbersOfPages)
//        for (key in subjectsWithNumbersOfPages.keys) {
//            val value = subjectsWithNumbersOfPages[key]!!
//            if (value >= 3) {
//                topSubjectsNP[key] = value
//            }
//        }
//        qo.setTopSubjects(topSubjectsNP)
//        return qo
//    }


}