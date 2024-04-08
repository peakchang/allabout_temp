import { back_api } from "$lib/const";

export const load = async ({ fetch, params, url }) => {
    const { id } = params;
    let datas = {};

    try {
        const resPosts = await fetch(`${back_api}/main/get_modify`, {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await resPosts.json();

        datas['get_content'] = result.get_content
        datas['get_category'] = result.get_category

    } catch (error) {
        console.error(error.message);

    }
    



    return { datas };
}