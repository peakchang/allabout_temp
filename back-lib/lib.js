import fs from 'fs'
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Seoul");


export const getQueryStr = (data, type, addTimeStr = '') => {
    let returnData = {
        str: '',
        question: '',
        values: []
    }
    if (type == 'insert') {

        for (const key in data) {
            returnData['str'] = returnData['str'] + `${key},`
            returnData['question'] = returnData['question'] + `?,`
            returnData['values'].push(data[key])
        }

        if (addTimeStr) {
            const now = moment().format('YYYY-MM-DD HH:mm:ss')

            console.log(returnData['str']);
            returnData['str'] = returnData['str'] + addTimeStr;
            console.log(returnData['str']);
            returnData['question'] = returnData['question'] + '?';
            returnData['values'].push(now)
        } else {
            returnData['str'] = returnData['str'].replace(/,$/, '');
            returnData['question'] = returnData['question'].replace(/,$/, '');
        }

    } else if (type == 'update') {
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        for (const key in data) {
            returnData['str'] = returnData['str'] + `${key}=?,`
            returnData['values'].push(data[key])
        }

        if (addTimeStr) {
            returnData['str'] = returnData['str'] + `${addTimeStr} = ?`;
            returnData['values'].push(now)
        } else {
            returnData['str'] = returnData['str'].replace(/,$/, '');
        }

    }

    return returnData;
}

export const imageFolderChk = () => {


    const now = moment().format('YYMMDD')

    if (import.meta.env.VITE_DEV_STATUS === 'product' || import.meta.env.VITE_DEV_STATUS === 'productDev') {
        try {
            fs.readdirSync(`public`);
        } catch (error) {
            fs.mkdirSync(`public`);
        }

        try {
            fs.readdirSync(`public/uploads`);
        } catch (error) {
            fs.mkdirSync(`public/uploads`);
        }
        try {
            fs.readdirSync(`public/uploads/editor`);
        } catch (error) {
            fs.mkdirSync(`public/uploads/editor`);
        }
        try {
            fs.readdirSync(`public/uploads/editor/editor${now}`);
        } catch (error) {
            fs.mkdirSync(`public/uploads/editor/editor${now}`);
        }
    } else {
        try {
            fs.readdirSync(`static`);
        } catch (error) {
            fs.mkdirSync(`static`);
        }
        try {
            fs.readdirSync(`static/editor`);
        } catch (error) {
            fs.mkdirSync(`static/editor`);
        }
        try {
            fs.readdirSync(`static/editor/editor${now}`);
        } catch (error) {
            fs.mkdirSync(`static/editor/editor${now}`);
        }
    }
}