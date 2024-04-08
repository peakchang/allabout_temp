import express from "express";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import { sql_con } from '../back-lib/db.js'

const subviewRouter = express.Router();



subviewRouter.post('/', async (req, res, next) => {
    console.log('여기는 들어와??');
    let status = true;
    const subDomainName = req.body.subDomainName
    let subView = "";
    console.log(subDomainName);
    try {
        const getSubDomainQuery = "SELECT * FROM sub_board WHERE sb_domain = ?";
        console.log(getSubDomainQuery);
        const getSubDomainCon = await sql_con.promise().query(getSubDomainQuery, [subDomainName]);
        console.log(getSubDomainCon);
        subView = getSubDomainCon[0][0]
    } catch (error) {

    }

    console.log(subView);

    console.log(subView);

    res.json({ status, subDomainName, subView })
})



export { subviewRouter }