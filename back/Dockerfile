#FROM azul/zulu-openjdk:11-latest
#RUN ./gradlew buildFatJar
#COPY build /app
#COPY gradle* /app
#WORKDIR /app
#CMD ["./gradlew", "runFatJar"]
# Stage 1: Build the Ktor server
FROM gradle:7.0.0-jdk11 as build-stage

WORKDIR /app

# Copy build.gradle and settings.gradle
COPY build.gradle.kts settings.gradle.kts gradle* ./

# Copy the source code
COPY src ./src

# Build the server
RUN gradle build --no-daemon

# Stage 2: Create a lightweight production image
FROM openjdk:11-jre-slim

WORKDIR /app

# Copy the built server from the previous stage
COPY --from=build-stage /app/build/libs/kolchanov-ktor-all.jar ./

# Copy users
COPY users ./

# Expose the server port
EXPOSE 8080

# Start the server
CMD ["java", "-jar", "kolchanov-ktor-all.jar"]