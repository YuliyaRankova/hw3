import {IncomingMessage, ServerResponse} from "node:http";
import {UserController} from "../controllers/UserController.ts";
import {BASE_URL, PORT} from "../config/userServerConfig.ts";
import {myLogger} from "../utils/logger.ts";

export  const userRouters =
    async (req:IncomingMessage, res:ServerResponse, controller:UserController) =>{

    const {url, method} = req;

    const parsedUrl = new URL(url!, BASE_URL+PORT);
    const pathName = parsedUrl.pathname;

    switch (pathName + method) {
        case "/api/users" + "POST":{
            await controller.addUser(req, res);
            break;
        }
        case "/api/users" + "GET":{
            await controller.getAllUsers(res);
            break;
        }
        case "/api/user" + "DELETE":{
            await controller.removeUser(req, res);
            break;
        }
        case "/api/user" + "PUT":{
            await controller.updateUser(req, res);
            break;
        }
        case "/api/user" + "GET":{
            await controller.getUser(req, res);
            break;
        }
        case "/api/logger" + "GET":{
            await controller.getLogArray(res);
            break;
        }
        default:{
            res.writeHead(404, {"Content-Type":"text/plain"});
            res.end("Page not found")
        }
    }
}