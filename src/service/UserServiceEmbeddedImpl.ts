import {UserService} from "./UserService.ts";
import {User} from "../model/userTypes.ts";

export class UserServiceEmbeddedImpl implements UserService{

    private users:User[] = [];

    addUser(user: User): boolean {
        if(this.users.findIndex((u:User) => u.id === user.id) === -1){
            this.users.push(user);
            return true;
        }
        return false;
    };

    getAllUsers(): User[] {
        return [...this.users];
    };

    getUser(userId: number):User|null {
        const index = this.getUserIndex(userId);
        if(index === -1)
            return null;
        return this.users[index];
    };

    removeUser(userId: number): User|null {
        const index = this.getUserIndex(userId);
        if(index === -1)
            return null;
        const removedUser = this.users.splice(index, 1)
        return removedUser[0];
    };

    updateUser(newUserData: User): boolean {
        const index = this.getUserIndex(newUserData.id)
        if(index === -1)
            return false;
        this.users[index] = newUserData;
        return true;
    };

    getUserIndex = (userId: number) => {
        const index = this.users.findIndex(u => u.id === userId)
        return index;
    }
};

