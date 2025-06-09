# ベースイメージ（Java 17）
FROM eclipse-temurin:17-jdk-alpine

# 作業ディレクトリを作成
WORKDIR /app

# jar ファイルをコピー（事前に build 済み）
COPY target/*.jar app.jar

# 実行コマンド
ENTRYPOINT ["java", "-jar", "app.jar"]