
export interface User{
    id?: number,
    name :string,
    email:string,
    password:string
    status : string| "verified" | "unverified",
    createdAt?: Date;
    updatedAt?: Date;   
}