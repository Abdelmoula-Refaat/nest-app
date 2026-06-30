import { Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, SignInDto } from "./createUser.dto";
import { AuthenticationGuard } from "src/common/guards/authentication.guards";
import { tokenType, Roles, Auth } from "src/common/decorator/auth.decorator";
import { RoleEnum } from "src/common/enum/user.enum";
import { User } from "src/common/decorator/user.decorator";
import * as userModal from "src/DB/models/user.modal";
import { TokenEnum } from "src/common/enum/token.enum";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import multerCloud from "src/common/utils/multer.utils";
import { Store_Enum, multer_enum } from "src/common/enum/multer.enum";

@Controller("users")
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    @Auth({ token_type: TokenEnum.access_token, access_roles: [RoleEnum.user]})
    getUsers() {
        return this.userService.getUsers();
    }

    @Post("signUp")
    signUp(@Body() body: CreateUserDto) {
        return this.userService.signUp(body);
    }

    @Post("signIn")
    signIn(@Body() body: SignInDto) {
        return this.userService.signIn(body);
    }

    @Get("/profile")
    @tokenType()
    @UseGuards(AuthenticationGuard)
    getProfile(@User() user: userModal.HUserDocument) {
        return { user }
        // return this.userService.getUsers();
    }


    @Post("/uplaod")
    @UseInterceptors(FileInterceptor(
        "attachment",
        multerCloud({ custom_types: multer_enum.image })))
    uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
        return this.userService.uploadProfileImage(file);
    }


}