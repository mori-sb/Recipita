# Javaベースイメージ
FROM eclipse-temurin:17-jdk-alpine

# 作業ディレクトリ
WORKDIR /app

# Mavenプロジェクト一式をコピー
COPY . .

# JARビルド（依存もDL）
RUN ./mvnw clean package -DskipTests

# JARを実行
CMD ["java", "-jar", "target/*.jar"]