import express from "express";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import { sql_con } from '../back-lib/db.js'

const admRouter = express.Router();



admRouter.post('/setting', async (req, res, next) => {

    let status = true;
    const body = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        if (body.configDataList.cf_pwd) {
            const hashed = await bcrypt.hash(body.configDataList.cf_pwd, salt);
            const cfUpdateQuery = "UPDATE config SET cf_pwd=? WHERE cf_base=?";
            await sql_con.promise().query(cfUpdateQuery, [hashed, 'base']);
        }

    } catch (error) {
        // console.error(error);
        status = false;
    }
    res.json({ status })
})



export { admRouter }