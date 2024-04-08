<script>

    import axios from "axios";
    import { Button } from "flowbite-svelte";
    import { back_api } from "$lib/const";

    let cf_pwd = "";

    async function configUpdate() {
        const configDataList = {
            cf_pwd,
        };
        try {

            const res = await axios.post(`${back_api}/adm/setting`,{ configDataList })
            if(res.data.status){
                alert('변경이 완료 되었습니다.')
                cf_pwd = ''
            }else{
                alert('에러 발생 다시 시도해주세요')
            }
        } catch (error) {
            console.error(error);
        }
    }
</script>

<div >
    <div class="text-right mr-6">
        <Button
            class="py-1 bg-blue-500 hover:bg-blue-600"
            on:click={configUpdate}>수정</Button
        >
    </div>

    <div class="mt-4">
        <div class="mb-2">
            ※ 카테고리와 메뉴명은 (,)콤마로 구분되며, 카테고리는 메뉴명 / 영어는
            해당 주소 링크가 되므로 같은 숫자로 맞춰주세요
        </div>

        <table class="w-full border-collapse">

            <tr>
                <th class="border border-slate-300 p-1"> 비밀번호 </th>
                <td class="border border-slate-300 p-1">
                    <input
                        type="text"
                        class="py-1 w-full rounded-lg border-gray-400"
                        bind:value={cf_pwd}
                    />
                </td>
            </tr>
        </table>
    </div>
</div>
