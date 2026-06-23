import { Model } from "mongoose";
import { User } from "../models/user.modal";
import BaseRepository from "./base.repository";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
class UserRepository extends BaseRepository<User> {

  constructor(@InjectModel(User.name) protected  model: Model<User>) {
    super(model);
  }
}

export default UserRepository;