// Response Archetype

export class ResponseUtil {
    static success(statusCode: number, message: string, data: any = null): any {
        return {
            statusCode,
            message,
            data,
        };
    }

    static error(statusCode: number, message: string, data: any = null): any {
        return {
            statusCode,
            message,
            data
        };
    }
}
