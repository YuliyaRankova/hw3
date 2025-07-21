import {UserService} from "../service/UserService.ts";
import {parseBody} from "../utils/tools.ts";
import {User} from "../model/userTypes.ts";
import {IncomingMessage, ServerResponse} from "node:http";
import {BASE_URL, PORT} from "../config/userServerConfig.ts";
import {myLogger} from "../utils/logger.ts";
import {URL} from "url";

export class UserController {
    constructor(private userService:UserService) {};

    async addUser(req:IncomingMessage, res:ServerResponse){
        try {
            const user = await parseBody(req) as User;
            const isSuccess = this.userService.addUser(user);
            if (isSuccess) {
                myLogger.save(`ADD USER - SUCCESS - User id ${user.id}`);
                myLogger.log(`ADD USER - SUCCESS - Response sent for id ${user.id}`);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end('User was added');
            } else {
                res.writeHead(409, {'Content-Type': 'text/html'});
                res.end('User already exists');
                myLogger.save(`ADD USER - CONFLICT - User id ${user.id} already exists`);
                myLogger.log(`ADD USER - CONFLICT - User id ${user.id} already exists`);
            }  
        }catch (e) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Server Error');
            myLogger.log(`ADD USER - ERROR - ${e}`);
        }
    };

    async getAllUsers(res:ServerResponse){
        try {
            const users = this.userService.getAllUsers();
            if(users.length != 0){
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(users));
                myLogger.log(`GET ALL USERS - SUCCESS - ${users.length} users returned`);
            } else{
                res.writeHead(404, {'Content-Type':'text/html'});
                res.end('Users not found');
                myLogger.log(`GET ALL USERS - NOT FOUND - No users in DB`);
            }
        }catch (e) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Server Error');
            myLogger.log(`GET ALL USERS - ERROR - ${e}`);
        }
    };

    async removeUser(req:IncomingMessage, res:ServerResponse){
        try {
            const user = await parseBody(req) as User;
            const isSuccess = this.userService.removeUser(user.id)
            if (isSuccess) {
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(isSuccess))
                myLogger.save(`REMOVE USER - SUCCESS - User id ${user.id} removed`)
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.end('User not found');
                myLogger.save(`REMOVE USER - NOT FOUND - User id ${user.id} not removed`);
                myLogger.log(`REMOVE USER - NOT FOUND - User id ${user.id}`);
            }
        }catch (e) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Server Error');
            myLogger.log(`REMOVE USER - ERROR - ${e}`);
        }
    };

    async updateUser(req:IncomingMessage, res:ServerResponse){
        try {
            const user = await parseBody(req) as User;
            const isSuccess = this.userService.updateUser(user)
            if (isSuccess) {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(`User id:${user.id} was updated`);
                myLogger.save(`UPDATE USER - SUCCESS - User id ${user.id} updated`);
                myLogger.log(`UPDATE USER - SUCCESS - Response sent for user id ${user.id}`);
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.end('User not found');
                myLogger.save(`UPDATE USER - NOT FOUND - User id ${user.id} not updated`);
                myLogger.log(`UPDATE USER - NOT FOUND - User id ${user.id}`);
            }
        }catch (e) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Server Error');
            myLogger.log(`UPDATE USER - ERROR - ${e}`);
        }
    };

    async getUser(req:IncomingMessage, res:ServerResponse){
        try {
            const parsedUrl = new URL(req.url!, BASE_URL+PORT);
            const id = parsedUrl.searchParams.get('id');

            if(!id){
                res.writeHead(409, {'Content-Type': 'text/html'});
                res.end('No id was received to find user');
                myLogger.log(`GET USER - ERROR - No id received`);
                return;
            };

                const founded = this.userService.getUser(+id);

                if(founded!==null){
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(founded));
                    myLogger.log(`GET USER - SUCCESS - Response sent for user id ${id}`);
                } else {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('User not found');
                    myLogger.log(`GET USER - NOT FOUND - User id ${id}`);
                }
        }catch (e) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Server Error');
            myLogger.log(`GET USER - ERROR - ${e}`);
        }
    };

    async getLogArray(res:ServerResponse){
        const allLogs = myLogger.getLogArray();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(allLogs));
    };

}