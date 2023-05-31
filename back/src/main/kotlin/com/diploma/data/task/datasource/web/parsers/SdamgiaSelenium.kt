package com.diploma.data.task.datasource.web.parsers

import com.diploma.data.task.TaskEntity
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.openqa.selenium.By
import org.openqa.selenium.WebDriver
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.remote.CapabilityType
import org.openqa.selenium.remote.DesiredCapabilities
import org.openqa.selenium.support.ui.ExpectedConditions
import org.openqa.selenium.support.ui.WebDriverWait
import java.util.*
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicLong
import java.util.regex.Pattern
import kotlin.math.ceil
import kotlin.streams.toList

class SdamgiaSelenium : WebTaskParser {

    companion object {

//        var driver: WebDriver // todo lol again
//
//        init {
//            val options = ChromeOptions()
//
//            options.addArguments("--disable-blink-features=AutomationControlled")
//            options.addArguments("--disable-extensions")
//            options.addArguments("--no-sandbox")
//            options.addArguments("--disable-dev-shm-usage")
//            options.addArguments("--disable-gpu")
//            options.addArguments("--disable-popup-blocking")
//            options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.4567.89 Safari/537.36")
//
//            val capabilities = DesiredCapabilities.chrome()
//            capabilities.setCapability(ChromeOptions.CAPABILITY, options)
//            capabilities.setCapability(CapabilityType.ACCEPT_SSL_CERTS, true)
//
//            driver = ChromeDriver(capabilities)
//        }

        val SUBJECT_DOMAINS = listOf(
            "mathb-ege", "ege", "inf-ege", "rus-ege", "en-ege", "phys-ege",
            "chem-ege", "bio-ege", "geo-ege", "soc-ege", "lit-ege", "hist-ege",
            "de-ege", "fr-ege"
        )

        val SUBJECT_NAMES = listOf(
            "Математика базового уровня", "Математика профильного уровня",
            "Информатика", "Русский язык",
            "Английский язык", "Физика",
            "Химия", "Биология",
            "География", "Обществознание",
            "Литература", "История",
            "Немецкий язык", "Французский язык"
        )

        val URLS = SUBJECT_DOMAINS.map{ "https://$it.sdamgia.ru/search" }

    }

    val pageSize: Int = 20
    val numPattern = Pattern.compile("\\d+")

    override fun getSubjectList(): List<String> = SUBJECT_NAMES
    override suspend fun searchTasks(query: String, page: Int, subjects: List<String>): List<TaskEntity> {
//        val subjects = subjects.toMutableList()
//        if (subjects.isEmpty()) {
//            for (url in URLS) {
//                driver.get(url)
//                if (driver.title.contains("Что-то пошло не так")) {
//                    // Wait for the checkbox element to be clickable
//                    val checkbox = driver.findElement(By.cssSelector("input[type='checkbox']"))
//                    WebDriverWait(driver, 10).until(ExpectedConditions.elementToBeClickable(checkbox))
//
//                    // Tick the checkbox
//                    checkbox.click()
//                    driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS)
//                }
//
//                println(driver.pageSource)
//            }
//        }
        // todo idk lol
        return emptyList()
//
//        val results = arrayListOf<TaskEntity>()
//        val id = AtomicInteger()
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
//                    print(e.message)
//                    return Collections.emptyList();
//                }
//
//            val tasksOnThisPage = doc.select("div[class=prob_maindiv]")
//            for (task in tasksOnThisPage) {
//                val questionBuilder = StringBuilder()
//                for (qElement in task.select("div[class=pbody]").select("p")) {
//                    questionBuilder.append(stringFromHtml(qElement.outerHtml())).append("\n");
//                }
//                val questionBuilderStr = questionBuilder.toString().trim()
//                if (!questionBuilderStr.contains(query)) continue // strict search
//                val question = questionBuilderStr.replace("&nbsp;", " ");
//
//                val answerBuilder = StringBuilder()
//                for ( aElement in task.select("div[class=solution]").select("p")) {
//                    answerBuilder.append(stringFromHtml(aElement.outerHtml())).append("\n");
//                }
//                val answer = answerBuilder.toString().trim().replace("&nbsp;", " ").replace("\n\n", "\n");
//
//                results.add(TaskEntity(id.get(), question, answer, subject));
//                id.getAndIncrement();
//            }
//        }
//        return results.toList()
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

}