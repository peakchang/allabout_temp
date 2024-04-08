
import cheerio from "cheerio";
import axios from "axios";
import { back_api, category_list, siteName } from "$src/lib/const";
import moment from "moment-timezone";

export const load = async ({ fetch, url }) => {

    let posts = []

    try {
        const res = await axios.get(`${back_api}/main/base`)
        posts = res.data.get_post_list

        if (posts) {
            for (let i = 0; i < posts.length; i++) {

                const getTimeStr = posts[i]['bo_updated_at'] ? posts[i]['bo_updated_at'] : posts[i]['bo_created_at']
                const dateStr = moment.tz(getTimeStr, 'Asia/Seoul');
                posts[i]["date_str"] = dateStr.format('YYYY-MM-DD HH:mm:ss');

                const $ = cheerio.load(posts[i]["bo_content"]);
                const imageTag = $("img");
                posts[i]["img_link"] = imageTag.length
                    ? imageTag.eq(0).attr("src")
                    : "/no-image.png";
                posts[i]["text"] = $("p").text();

                const getCategoryObj = category_list.find(v => v.link === posts[i]["bo_category"]);
                posts[i]["category"] = getCategoryObj['name']
            }
        }


    } catch (error) {
        console.error(error.message);
    }

    const seoValue = {
        title: siteName,
        description: '부동산 분양의 모든것! 아파트 분양, 오피스텔 분양, 상가 분양, 지식산업센터 분양 등 현재 진행중인 분양 및 청약, 미분양 정보 안내',
        url: url.href,
        image: `${url.href}logo.png`,
        date: '23-12-07',
        published_time: '2023-12-07T11:46:53+00:00',
        icon: `${url.href}favicon.png`,
    }

    return { posts, seoValue }
}