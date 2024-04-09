// place files you want to import through the `$lib` alias in this folder.

// 건강정보,연예정보,맛집정보,분양정보,기타정보
export const category_list = [
    {link : 'health', name : '건강뉴스', type : 'img'},
    {link : 'estate', name : '기타뉴스', type : 'board'},
    {link : 'news', name : '휴대폰뉴스', type : 'img'},
]

export const siteName = '올어바웃폰'

export const back_api = `${import.meta.env.VITE_SERVER_URL}/api/v3`