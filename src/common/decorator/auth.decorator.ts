import { applyDecorators, SetMetadata } from "@nestjs/common";
import { TokenEnum } from "../enum/token.enum";
import { RoleEnum } from "../enum/user.enum";
import { UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "../guards/authentication.guards";
import { AuthorizationGuard } from "../guards/authorization.guards ";


export const token_type_key = "token_type_key";
export const aceess_roles_key = "aceess_roles_key";

export const tokenType = (token_type: TokenEnum = TokenEnum.access_token) => {
    return SetMetadata(token_type_key, token_type);
}
export const Roles = (access_roles: RoleEnum[]) => {
    return SetMetadata(aceess_roles_key, access_roles);
}

export function Auth({ token_type, access_roles }: { token_type: TokenEnum, access_roles: RoleEnum[]}) {
    return applyDecorators(
        tokenType(token_type),
        Roles(access_roles),
        UseGuards(AuthenticationGuard, AuthorizationGuard),
    );
}