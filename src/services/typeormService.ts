import {getConnection} from "typeorm";

export const query=async(tableName,repository,queryStatement,queryCondition)=>{
// const result = await getConnection()
//     .createQueryBuilder()
//     .select("user")
//     .from(User, "user")
//     .where("user.id = :id", { id: 1 })
//     .getOne();
    const result = await getConnection()
    .createQueryBuilder()
    .select(tableName)
    .from(repository, tableName)
    .where(queryStatement, queryCondition)
    .getMany();

    return result
}