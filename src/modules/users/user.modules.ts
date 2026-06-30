import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserModel } from "src/DB/models/user.modal";
import UserRepository from "src/DB/repository/user.repository";
import RedisService from "src/common/service/redis.service";
import { RedisModule } from "src/common/redis/redis.module";
import TokenService from "src/common/service/token.service";
import { JwtService } from "@nestjs/jwt";
import { S3Service } from "src/common/service/s3.service";


@Module({
    imports: [UserModel, RedisModule],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        RedisService,
        TokenService,
        JwtService,
        S3Service
    ],
    exports: []
})
export class UserModule {};
