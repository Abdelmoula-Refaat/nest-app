import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, SignInDto } from "./createUser.dto";

@Controller("users")
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
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

}