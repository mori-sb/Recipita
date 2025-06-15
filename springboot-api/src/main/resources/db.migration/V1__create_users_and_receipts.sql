-- レシート本体
 CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   uid VARCHAR(128) UNIQUE NOT NULL,
   email VARCHAR(255),
   anonymous BOOLEAN DEFAULT false,
   created_at TIMESTAMP DEFAULT NOW()
 );

 CREATE TABLE IF NOT EXISTS receipt (
   id BIGSERIAL PRIMARY KEY,
   user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
   store VARCHAR(255),
   total_amount INTEGER,
   date DATE DEFAULT CURRENT_DATE,
   image_path VARCHAR(255)
 );

 CREATE TABLE IF NOT EXISTS receipt_category (
   id BIGSERIAL PRIMARY KEY,
   receipt_id BIGINT NOT NULL,
   category_name VARCHAR(100),
   amount INTEGER,
   FOREIGN KEY (receipt_id) REFERENCES receipt(id) ON DELETE CASCADE
 );