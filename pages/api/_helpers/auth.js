
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const SECRET_KEY = process.env.SECRET_KEY || "change-me";
const ALGO = "HS256";
export function hashPassword(p){ return bcrypt.hashSync(p,10); }
export function verifyPassword(plain,hash){ return bcrypt.compareSync(plain,hash); }
export function createAccessToken(subject){ return jwt.sign({sub:subject},SECRET_KEY,{algorithm:ALGO,expiresIn:60*60*24*7}); }
export function decodeAccessToken(token){ try{ return jwt.verify(token,SECRET_KEY,{algorithms:[ALGO]}); }catch(e){return null;} }
