import express from "express";
import { sql_con } from '../back-lib/db.js'
import bcrypt from "bcrypt";
import cheerio from "cheerio";

import moment from "moment-timezone";
const koreaTime = moment.tz('Asia/Seoul');

const apiRouter = express.Router();

apiRouter.get('/test_time', (req, res, next) => {

    console.log('아예 못들어오는거야?!?!?!?');


    const now1 = koreaTime.format('YYYY-MM-DD HH:mm:ss');
    console.log(now1);
    console.log("△ 코리아타임 --------------------------------");

    const now2 = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log(now2);
    console.log("△ 모먼트기본 --------------------------------");
    let today = new Date();
    const now3 = moment.tz(today, 'Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    console.log(now3);
    console.log("△ 현재시간변환 --------------------------------");

    res.json({ status: true })

})

apiRouter.post('/', async (req, res, next) => {
    const body = req.body;
    let validPassword = true;
    try {
        const getPwdQuery = "SELECT cf_pwd FROM config WHERE cf_base='base';";
        const getPwd = await sql_con.promise().query(getPwdQuery);
        const get_pwd = getPwd[0][0];
        validPassword = await bcrypt.compare(body.pwdVal, get_pwd.cf_pwd);

    } catch (error) {
        console.error(error.message);
        validPassword = false;
    }
    res.json({ validPassword })
})

apiRouter.post('/add_post_list', async (req, res, next) => {
    const body = req.body;
    let listStatus = true;
    const getPostListQuery = "SELECT * FROM board ORDER BY bo_id DESC LIMIT ?, 10";
    const getPostList = await sql_con.promise().query(getPostListQuery, [body.postNum]);
    const posts = getPostList[0];

    for (let i = 0; i < posts.length; i++) {
        const date = new Date(posts[i].bo_created_at);
        const year = date.getFullYear().toString().slice(2); // '23'
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // '07'
        const day = date.getDate().toString().padStart(2, "0"); // '14'
        posts[i]["date_str"] = `${year}.${month}.${day}`;


        const $ = cheerio.load(posts[i]["bo_content"]);
        const imageTag = $("img");
        posts[i]["img_link"] = imageTag.length
            ? imageTag.eq(0).attr("src")
            : "/no-image.png";
        posts[i]["text"] = $("p").text();
    }


    if (posts.length < 10) {
        listStatus = false;
    }

    res.json({ posts, listStatus })
})



export { apiRouter }