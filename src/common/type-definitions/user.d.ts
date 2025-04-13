import { IUSER } from "src/modules/user/interface/user-request.interface";

declare global {
    namespace Express {
        interface Request {
            user?: IUSER
        }
    }
}