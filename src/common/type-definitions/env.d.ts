namespace NodeJs {
    interface ProcessEnv {
        // application
        PORT: number
        // database
        DB_PORT: number
        DB_NAME: string
        DB_USERNAME: string
        DB_PASSWORD: string
        DB_HOST: string
    }
}