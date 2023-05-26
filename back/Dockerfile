FROM azul/zulu-openjdk:11-latest
COPY . /app
WORKDIR /app
RUN ./gradlew buildFatJar
CMD ["./gradlew", "runFatJar"]
