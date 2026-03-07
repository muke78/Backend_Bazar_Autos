import { listProfileService } from "../services/users-services.js";

export const GetProfile = async (user_id) => {
    const listGetProfile = await listProfileService(user_id);
    return listGetProfile;
};