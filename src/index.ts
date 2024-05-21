import {handleHttpRequests} from "./handlers";

export const handler =  async (event: any, context: any): Promise<any> => {
    return handleHttpRequests(event, context);
};

