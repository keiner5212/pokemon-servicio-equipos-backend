import { ConfigService } from "@nestjs/config";

export class Config {
    private static configService: ConfigService;

    public static init(configService: ConfigService) {
        this.configService = configService;
    }

    public static get FB_API_KEY(): string {
        return this.configService.get<string>("FB_API_KEY") || "";
    }

    public static get FB_AUTH_DOMAIN(): string {
        return this.configService.get<string>("FB_AUTH_DOMAIN") || "";
    }

    public static get FB_PROJECT_ID(): string {
        return this.configService.get<string>("FB_PROJECT_ID") || "";
    }

    public static get FB_STORAGE_BUCKET(): string {
        return this.configService.get<string>("FB_STORAGE_BUCKET") || "";
    }

    public static get FB_MESSAGE_SENDER_ID(): string {
        return this.configService.get<string>("FB_MESSAGE_SENDER_ID") || "";
    }

    public static get FB_APP_ID(): string {
        return this.configService.get<string>("FB_APP_ID") || "";
    }

    public static get FB_API_USER_EMAIL(): string {
        return this.configService.get<string>("FB_API_USER_EMAIL") || "";
    }

    public static get FB_API_USER_PASSWORD(): string {
        return this.configService.get<string>("FB_API_USER_PASSWORD") || "";
    }
}
