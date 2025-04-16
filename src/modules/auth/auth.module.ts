import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtService} from "@nestjs/jwt";
import { UserEntity } from "../user/entity/user.entity";
import { UserOtpEntity } from "../user/entity/otp.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserOtpEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService, TypeOrmModule],
})
export class AuthModule {}
