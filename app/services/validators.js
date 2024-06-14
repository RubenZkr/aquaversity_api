import jwt from "jsonwebtoken";


export const isAdmin = (token) => {
    if (!token) {
        return false;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { role } = decoded;
        return role === "admin";
    }
}
    


    