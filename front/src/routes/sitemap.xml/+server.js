import { category_list } from "$src/lib/const";
import { sql_con } from '$lib/server/db'
import moment from "moment-timezone";

export async function GET({ url }) {

    console.log(category_list);

    let boardXmlStr = `
    <url>
        <loc>${url.origin}</loc>
        <lastmod>2023-12-08</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    `

    for (let i = 0; i < category_list.length; i++) {
        const categoryTamplate = `
        <url>
            <loc>${url.origin}/${category_list[i]['link']}</loc>
            <lastmod>2023-12-08</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
        </url>
        `
        boardXmlStr = boardXmlStr + categoryTamplate
    }

    // try {
    //     const getBoardListQuery = "SELECT * FROM board ORDER BY bo_id DESC";
    //     const getBoardList = await sql_con.promise().query(getBoardListQuery);
    //     const boardList = getBoardList[0]

    //     for (let i = 0; i < boardList.length; i++) {
    //         // published_time
    //         const getTimeStr = boardList[i]['bo_updated_at'] ? boardList[i]['bo_updated_at'] : boardList[i]['bo_created_at']
    //         const dateStr = moment.tz(getTimeStr, 'Asia/Seoul');
    //         const getDate = dateStr.format('YYYY-MM-DD');
    //         // const getDate = dateStr.format('YYYY-MM-DDTHH:mm:ssZ');

    //         let template = `
    //         <url>
    //         <loc>${url.origin}/view/${boardList[i]['bo_id']}</loc>
    //             <lastmod>${getDate}</lastmod>
    //             <changefreq>monthly</changefreq>
    //             <priority>0.5</priority>
    //         </url>
    //         `
    //         boardXmlStr = boardXmlStr + template
    //     }

    // } catch (error) {

    // }

    return new Response(
        `
        <?xml version="1.0" encoding="UTF-8" ?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

        ${boardXmlStr}

        </urlset>`.trim(),
        {
            headers: {
                'Content-Type': 'application/xml'
            }
        }
    );
}
