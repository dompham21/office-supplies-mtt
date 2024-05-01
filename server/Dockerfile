FROM eclipse-temurin:17-jdk-focal as build
 
WORKDIR /build

COPY .mvn/ ./.mvn
COPY mvnw pom.xml  ./
RUN ./mvnw dependency:go-offline

COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /build/target/doan-0.0.1-SNAPSHOT.jar run.jar
ENTRYPOINT ["java", "-jar", "/app/run.jar"]

