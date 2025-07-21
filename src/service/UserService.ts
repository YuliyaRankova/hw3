import {User} from "../model/userTypes.ts";

export interface UserService{
    addUser(user:User):boolean;
    getAllUsers():User[];
    getUser(userId:number):User|null;
    removeUser(userId:number):User|null;
    updateUser(newUserData:User):boolean;
}