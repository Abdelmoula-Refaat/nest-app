import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import UserRepository from "src/DB/repository/user.repository";
import { CreateUserDto, SignInDto } from "./createUser.dto";
import { Compare, Hash } from "src/common/utils/security/hash";
import { encrypt } from "src/common/utils/security/encrypt.security";
import { generateOtp, sendEmail } from "src/common/utils/email/send.email";
import { eventEmitter } from "src/common/utils/email/email.events";
import { EmailEnum } from "src/common/enum/email.enum";
import { emailTemplate } from "src/common/utils/email/email.template";
import RedisService from "src/common/service/redis.service";
import TokenService from "src/common/service/token.service";
import { randomUUID } from "crypto";
import { RoleEnum } from "src/common/enum/user.enum";

@Injectable()
export class UserService {
    
    constructor(
        private readonly userRepository: UserRepository,
        private readonly redisService: RedisService,
        private readonly tokenService: TokenService
    ) { }

    async getUsers() {
        return await this.userRepository.find();
    }


    async signUp(body: CreateUserDto) {
        const { age, cPassword, email, userName, password, phone} = body;
        const emailExist = await this.userRepository.findOne({
            filter: {email}
        });
        if(emailExist) throw new ConflictException("email already exists")
        const otp = await generateOtp();
        eventEmitter.emit(EmailEnum.confirmEmail, async () => {
            await sendEmail({ to: email, subject: "email confirmation", html: emailTemplate(otp) })
            await this.redisService.set_value({key: this.redisService.otp_key({ email, subject: EmailEnum.confirmEmail }), value:{otp}, ttl: 60 * 30 });
            await this.redisService.set_value({key: this.redisService.max_otp_key(email), value: "1", ttl: 60 * 30 });
        })
        const user = await this.userRepository.create({
            age,
            email,
            phone: encrypt(phone),
            password,
            userName
            
        });
        return user;
    }

    async signIn(body: SignInDto) {
        const {email, password}: SignInDto = body;
        const user = await this.userRepository.findOne({
            filter: {email}
        });
        if(!user) throw new BadRequestException("user not exists or invaild provider")
       
        if(!Compare({plain_text: password, cipher_text: user.password})) throw new BadRequestException("password not valid")
        const uuid = randomUUID();

        const access_token = await this.tokenService.GenerateToken({
            payload: {
                id: user._id,
                email: user.email 
            },
            options: { 
                secret: user.role == RoleEnum.user ? process.env.ACCESS_SECRET_KEY_USER! : process.env.ACCESS_SECRET_KEY_Admin!,
                expiresIn: "1d",
                jwtid: uuid 
            }
        });

        const refresh_token = await this.tokenService.GenerateToken({
            payload: {
                id: user._id,
                email: user.email 
            },
            options: { 
                secret: user.role == RoleEnum.user ? process.env.REFRESH_SECRET_KEY_USER! : process.env.REFRESH_SECRET_KEY_Admin!,
                expiresIn: "1y",
                jwtid: uuid 
            }
        });
        return {access_token, refresh_token};
    }
}