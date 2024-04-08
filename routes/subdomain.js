import express from "express";
import { sql_con } from '../back-lib/db.js'
import moment from "moment-timezone";
const koreaTime = moment.tz('Asia/Seoul');

const subdomainRouter = express.Router();

subdomainRouter.post('/write', async (req, res, next) => {
    let status = true;
    const subject = req.body.subject;
    const content = req.body.content;
    const now = koreaTime.format('YYYY-MM-DD HH:mm:ss');
    const getId = req.body.getId;

    try {
        const updateQuery = "UPDATE sub_board SET sb_subject = ?, sb_content = ?, sb_created_at = ? WHERE sb_id = ?";
        await sql_con.promise().query(updateQuery, [subject, content, now, getId]);
    } catch (error) {
        status = false;
    }
    res.json({ status })

})

subdomainRouter.get('/get_subdomain_list', async (req, res, next) => {
    console.log('서브 도메인 리스트는 오지?!?!?!');
    let status = true;
    let sub_domain_list = [];
    try {
        const getSubdomainListQuery = "SELECT * FROM sub_board ORDER BY sb_id DESC";
        const getSubdomainList = await sql_con.promise().query(getSubdomainListQuery);
        sub_domain_list = getSubdomainList[0];
    } catch (error) {
        status = false;
    }
    console.log(sub_domain_list);
    res.json({ status, sub_domain_list })
})
subdomainRouter.post('/add_subdomain', async (req, res, next) => {
    let status = true;
    const addSubdomainName = req.body.addSubdomainName;
    try {
        const addSubdomainQuery = "INSERT INTO sub_board (sb_domain) VALUES (?)";
        await sql_con.promise().query(addSubdomainQuery, [addSubdomainName]);
    } catch (error) {
        status = false;
    }

    res.json({ status })
})



export { subdomainRouter }