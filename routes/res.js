import express from "express";
import { sql_con } from '../back-lib/db.js'
import bcrypt from "bcrypt";
import cheerio from "cheerio";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Seoul");

const resRouter = express.Router();


resRouter.use('/add_work_list', async (req, res, next) => {
    let status = 'success';
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    const getLink = `${req.query.now_link}/bbs/board.php?bo_table=${req.query.board_id}&wr_id=${req.query.wr_id}`
    try {
        const insertWorkQuery = "INSERT INTO backlink_works (bw_link, bw_created_at) VALUES (?,?)";
        await sql_con.promise().query(insertWorkQuery, [getLink, now]);
    } catch (error) {
        status = 'fail'
    }
    res.json({ status })
})

resRouter.use('/update_faulty_site', async (req, res, next) => {
    let status = 'success';
    console.log('앙뇽하세요');
    const nowNum = req.query.now_row
    const nowMemo = req.query.now_memo
    try {
        const updateFaultyQuery = "UPDATE backlinks SET bl_status = false, bl_memo = ? WHERE bl_id = ?";
        await sql_con.promise().query(updateFaultyQuery, [nowMemo, nowNum]);
    } catch (error) {
        console.log(error.message);
        status = 'fail'
    }
    res.json({ status })
})


resRouter.use('/test_data', async (req, res, next) => {
    let nowNum = 0;
    const testData = 'gogogogogo'
    console.log('요기는 들어오는고지??');
    console.log(req.query);
    let get_work = {}
    nowNum = req.query.now_row


    let work_list = [];


    while (true) {
        try {
            const getWorkLinkQuery = "SELECT * FROM backlinks WHERE bl_id > ? AND bl_status = true ORDER BY bl_id ASC LIMIT 1;"
            const getWorkLink = await sql_con.promise().query(getWorkLinkQuery, [nowNum]);
            get_work = getWorkLink[0][0];
            if (get_work) {
                break
            } else {
                nowNum = 0
            }
        } catch (error) {

        }
    }

    try {
        const allWorkListQuery = "SELECT * FROM target";
        const allWorkList = await sql_con.promise().query(allWorkListQuery);
        const all_work_list = allWorkList[0];
        work_list = shuffleArray(all_work_list)

    } catch (error) {

    }

    // console.log(get_work);
    res.json({ work_list, get_work })
})




function shuffleArray(arr) {
    // 배열의 길이가 10 이하인 경우, 배열을 그대로 반환
    if (arr.length <= 10) {
        return arr;
    }

    // 10에서 13 사이의 랜덤한 개수를 선택
    const numToSelect = Math.floor(Math.random() * 4) + 10;

    // 배열을 복제하여 원본 배열을 변경하지 않도록 함
    const clonedArr = [...arr];

    // 배열을 랜덤하게 섞음
    for (let i = clonedArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clonedArr[i], clonedArr[j]] = [clonedArr[j], clonedArr[i]];
    }

    // 선택된 개수만큼 요소를 잘라냄
    const selectedArr = clonedArr.slice(0, numToSelect);

    return selectedArr;
}


export { resRouter }