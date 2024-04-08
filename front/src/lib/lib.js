export const extractFirstImageSrc = (htmlString) => {
    // 정규식 패턴을 사용하여 첫 번째 이미지 태그를 찾습니다.
    const pattern = /<img[^>]*src="([^"]*)"/;

    // 정규식에 매치되는 결과를 가져옵니다.
    const match = htmlString.match(pattern);

    // 매치된 결과가 있다면 첫 번째 이미지 태그의 src 속성 값을 반환합니다.
    if (match && match.length > 1) {
        return match[1];
    } else {
        return null; // 매치된 이미지 태그가 없을 경우 null을 반환합니다.
    }
}

export function extractTextFromTags(htmlString) {
    // 정규식 패턴을 사용하여 모든 태그 내의 텍스트를 추출합니다.
    const pattern = /<[^>]*>([^<]*)/g;

    // 정규식에 매치되는 결과를 배열로 반환합니다.
    const matches = htmlString.match(pattern);

    // 매치된 결과에서 태그를 제외하고 텍스트만 추출하여 배열로 반환합니다.
    if (matches) {
        const textArray = matches.map(match => match.replace(/<[^>]*>/g, ''));
        const filteredTextArray = textArray.filter(text => text !== '');
        const returnTxt = filteredTextArray.join(' ')
        return returnTxt;
    } else {
        return [];
    }
}


export const returnObjOtherVal = (obj, inpKey, inpVal, outKey) => {
    // @ts-ignore
    for (const itj of obj) {
        if (itj[inpKey] === inpVal) {
            return itj[outKey]
        }
    }
}


export const convertTextareaToPTag = (text) => {
    const paragraphs = text
        .split("\n")
        .map((p) => `<p>${p}</p>`)
        .join("");
    return paragraphs;
}


export const formatDate = (date) => {

    const dateParts = date.split("T")[0].split("-");

    // dateParts 배열에서 년, 월, 일을 추출합니다.
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const formattedDate = `${year} .${parseInt(month)} .${parseInt(day)}`;

    return formattedDate;
}

export const hideLastTwoSegments = (ipAddress) => {
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

export const dataURItoBlob = (dataURI) => {
    const bytes =
        dataURI.split(",")[0].indexOf("base64") >= 0
            ? atob(dataURI.split(",")[1])
            : unescape(dataURI.split(",")[1]);
    const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
};