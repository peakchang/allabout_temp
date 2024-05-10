import axios from 'axios';
import cheerio from "cheerio";
import { back_api, category_list } from '$src/lib/const';
import moment from "moment-timezone";


export const prerender = false;

export const load = async ({ params, url }) => {

    const { id } = params;
    let nextPosts = []
    let previousPosts = []
    let content;
    let get_reply;

    let seoValue = {
        title: "",
        description: '',
        url: url.href,
        image: "",
        date: '',
        published_time: '',
        icon: `${url.origin}/favicon.png`,
    }

    try {
        const res = await axios.post(`${back_api}/main/board_detail`, { id })

        content = res.data.content;

        content['getContentText'] = content.bo_content;
        nextPosts = res.data.get_next_post
        previousPosts = res.data.get_previous_post

        // 타이틀
        seoValue["title"] = content.bo_subject;
        // description
        const viewTextOnly = content['bo_content'].replace(/<[^>]+>/g, ' ');
        const viewTextOnlyFilter = viewTextOnly.replace(/\s+/g, ' ').trim();
        seoValue['description'] = truncateTextTo100Chars(viewTextOnlyFilter);
        // image
        const $ = cheerio.load(content['getContentText']);
        const imageTag = $("img");
        seoValue["image"] = imageTag.length
            ? imageTag.eq(0).attr("src")
            : "/no-image.png";

        // published_time
        seoValue['published_time'] = content['bo_updated_at'] ? content['bo_updated_at'] : content['bo_created_at']

        // date
        const date = new Date(seoValue['published_time']);
        const dateStr = moment.tz(date, 'Asia/Seoul');
        seoValue['date'] = dateStr.format('YYYY-MM-DD');
        content["date_str"] = dateStr.format('YYYY-MM-DD HH:mm');

        // 카테고리
        const getCategoryObj = category_list.find(v => v.link === content["bo_category"]);
        content["category"] = getCategoryObj['name']


    } catch (error) {
        console.error(error.message);
    }


    // 여기서부턴 댓글

    try {

        const res = await axios.post(`${back_api}/main/get_reply`, {
            id
        })

        get_reply = res.data.get_reply;

        for (let i = 0; i < get_reply.length; i++) {
            get_reply[i]["hidden_ip"] = hideLastTwoSegments(
                get_reply[i]["re_ip"]
            );
            const date = new Date(get_reply[i]['re_created_at']);
            const dateStr = moment.tz(date, 'Asia/Seoul');
            get_reply[i]['date'] = dateStr.format('YYYY-MM-DD HH:mm');
        }



    } catch (error) {
        console.error(error.message);
    }

    return { content, seoValue, get_reply, nextPosts, previousPosts }
}


function hideLastTwoSegments(ipAddress) {
    const segments = ipAddress.split(".");
    if (segments.length < 4) {
        // 유효한 IP 주소가 아님
        return "Invalid IP address";
    }

    // 마지막 두 부분을 '*'로 대체
    segments[2] = "*";
    segments[3] = "*";

    return segments.join(".");
}


function truncateTextTo100Chars(text) {
    if (text.length <= 100) {
        return text;
    }

    // 100자 뒤의 가장 가까운 띄어쓰기를 찾음
    const truncatedText = text.substr(0, 200);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');

    if (lastSpaceIndex === -1) {
        // 띄어쓰기를 찾지 못한 경우, 그냥 100자까지 자름
        return truncatedText;
    }

    // 가장 가까운 띄어쓰기까지 잘라서 반환
    return truncatedText.substr(0, lastSpaceIndex);
}