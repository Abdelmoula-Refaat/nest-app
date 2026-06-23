import { ArgumentMetadata, HttpException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodType } from "zod";


@Injectable()
export class ZodVaildatePipe implements PipeTransform{
    constructor(private schema: ZodType) { }
    transform(value: any, metadata: ArgumentMetadata) {
        const { success, error } = this.schema.safeParse(value);
        if(!success) {
            throw new HttpException({
                message: "Validation error",
                error: error.issues.map((issue) => {
                    return {
                        path: issue.path[0],
                        message: issue.message
                    }
                }),
            }, 400);
        }

        return value;
    }
}