import express from "express";
import multer from "multer";
import fs from 'fs'
import moment from "moment-timezone";
import { log } from "console";
moment.tz.setDefault("Asia/Seoul");

const editorRouter = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        // 경로를 설정
        destination(req, file, cb) {
            const setFolder = fonderChk();
            cb(null, setFolder);
        },
        filename(req, file, cb) {
            //파일명 설정
            cb(null, file.originalname);
        },
    }),
    // limits: { fileSize: 10 * 1024 * 1024 },
});


editorRouter.post('/img_upload', upload.single('editorimg'), async (req, res, next) => {
    console.log('이쪽은 들어오는거야?!?!?!?');
    let baseUrl
    let saveUrl
    if (req.method === 'POST') {
        const lastFolderArr = req.file.destination.split('/');
        const lastFolder = lastFolderArr[lastFolderArr.length - 1];
        const currentUrl = req.protocol + '://' + req.get('host')
        ;
        baseUrl = currentUrl + '/editor/' + lastFolder + '/' + req.file.filename;
        saveUrl = req.file.path
    }
    res.json({ baseUrl, saveUrl })
})


editorRouter.post('/video_upload', upload.single('videofile'), async (req, res, next) => {
    let baseUrl
    let saveUrl
    if (req.method === 'POST') {
        const lastFolderArr = req.file.destination.split('/');
        const lastFolder = lastFolderArr[lastFolderArr.length - 1];
        var origin = req.get('origin');
        baseUrl = origin + '/editor/' + lastFolder + '/' + req.file.filename;
        saveUrl = req.file.path
    }
    res.json({ baseUrl, saveUrl })
})

editorRouter.post('/nosave_del', async (req, res, next) => {
    const data = req.body
    const deleteArr = data.deleteArr;

    for (let i = 0; i < deleteArr.length; i++) {
        const delPath = deleteArr[i];
        try {
            fs.unlinkSync(delPath)
        } catch (error) {
            console.error(error);
        }
    }
    res.json({})
})



function fonderChk() {
    let setFolder
    const now = moment().format('YYMMDD')

    try {
        fs.readdirSync(`public`);
    } catch (error) {
        console.error(error.message);
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
    setFolder = `public/uploads/editor/editor${now}`

    return setFolder;
}


export { editorRouter }