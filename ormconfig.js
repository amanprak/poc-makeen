module.exports = 
  {
    "type": "postgres",
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "synchronize": true,
    "logging": false,
    "dropSchema": process.env.NODE_ENV === "test" ? true : false,
    "entities": [
      __dirname + "/src/entities/**/*.ts"
    ],
    "migrations": [
      __dirname + "/src/migration/**/*.ts"
    ],
    "subscribers": [
      __dirname + "/src/subscriber/**/*.ts"
    ],
    "cli": {
      "entitiesDir": __dirname + "/src/entities",
      "migrationsDir": __dirname + "/src/migration",
      "subscribersDir": __dirname + "/src/subscriber"
    }
  }

