
export { };
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            /**
             * IS_LOCAL enables webpack to run in development mode
             */
            IS_LOCAL: string;
            /**
             * ENV to decide webpack to run in development or production mode
             * It can also use to load different environment variables based on env like staging etc.
             */
            ENV: "development" | "cypress" | "production";
            /**
             * WATCH enables to run webpack in watch mode
             * Use WATCH only you want to disable watch with value WATCH=false
             */
            WATCH: boolean;
            /**
             * Base url of api
             * API_BASE_URL will use to proxy api request from frontend server
             */
            API_BASE_URL?: string;
            /**
             * This project creates a test api server for only for local development
             * on port 3002
             * You can use test api server to create mock api for frontend development
             * check /test-api.ts
             */
            LOCAL_API_SERVER: string;
            NODE_ENV?: string;
            /**
             * Set this env to generate stats when webpack build
             */
            STATS?: string;
        }
    }
}
