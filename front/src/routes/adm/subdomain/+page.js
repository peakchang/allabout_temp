
import axios from "axios";
import { back_api } from "$src/lib/const";


export const load = async ({ fetch, url }) => {
    console.log('일단 오긴 하지?1');
    let subDomainList = [];

    try {
        const res = await axios.get(`${back_api}/subdomain/get_subdomain_list`)
        if(res.data.status){
            subDomainList = res.data.sub_domain_list
        }
    } catch (error) {
        
    }
    console.log(subDomainList);
    return { subDomainList }
}