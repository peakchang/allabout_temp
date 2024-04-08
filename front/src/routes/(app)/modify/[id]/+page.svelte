<script>
    import { page } from "$app/stores";
    import Editor from "$lib/components/Editor.svelte";
    import axios from "axios";
    import { beforeNavigate, goto } from "$app/navigation";
    import { back_api } from "$lib/const";

    // @ts-ignore
    import Cookies from "js-cookie";
    import cheerio from "cheerio";

    export let data;
    

    let categoryList = data.datas.get_category.cf_category.split(",");
    let subject = data.datas.get_content.bo_subject;
    let category = data.datas.get_content.bo_category;
    let keyword = data.datas.get_content.bo_keyword;
    let description = data.datas.get_content.bo_description;
    let getId = $page.params.id;

    
    let content = data.datas.get_content.bo_content;
    let getContentText = data.datas.get_content.bo_content;

    let workStatus = false; // 값이 true 면 새로고침시 체크

    const l = cheerio.load(getContentText);
    const imageTag = l("img");
    const iframeTag = l("iframe");

    const tempImgArr = getSrcList(l, imageTag);
    const tempVideoArr = getSrcList(l, iframeTag);
    let contentArr = tempImgArr.concat(tempVideoArr);
    
    
    

    function getSrcList($, tagList) {
        const tempImgArr = tagList
            .map((index, element) => {
                const imageUrl = $(element).attr("src");
                const newImageUrl = imageUrl.replace(
                    /^(https?:\/\/)?[^/]+/,
                    ""
                );

                let startFolder;
                if (import.meta.env.VITE_STATUS == "dev") {
                    startFolder = "front/static";
                } else {
                    startFolder = "public/uploads";
                }
                const reImgUrl = startFolder + newImageUrl;
                return reImgUrl;
            })
            .get();

        return tempImgArr;
    }

    const uploadContent = async () => {
        if (!subject || !category) {
            alert("제목 or 카테고리 미선택! 선택해주세여");
            return false;
        }

        // 지울 목록 찾기 (에디터에 없는 항목만 배열로 남겨놓기)

        for (let i = 0; i < contentArr.length; i++) {
            const element = contentArr[i];
            if (element.includes("/")) {
                var ttt = element.split("/");
            } else {
                var ttt = element.split("\\");
            }

            var kkk = ttt[ttt.length - 1];

            if (content.includes(kkk)) {
                contentArr[i] = "";
            }
        }

        await axios
            .post(
                `${back_api}/board/modify`,
                {
                    subject,
                    category,
                    content,
                    contentArr,
                    keyword,
                    description,
                    getId,
                }
            )
            .then((res) => {
                if (res.data.status == "success") {
                    workStatus = false;
                    alert("글 수정이 완료 되었습니다.");
                    goto(`/view/${getId}`);
                }
            });
    };

    const getEditorContent = (e) => {
        content = e.detail.editorContent;
        if (!content || content == "<p><br></p>") {
            workStatus = false;
        } else {
            workStatus = true;
        }
    };

    beforeNavigate(async ({ from, to, cancel }) => {
        if (workStatus) {
            if (
                confirm(
                    "페이지에서 나가시겠습니까? 작성중인 문서는 삭제됩니다."
                )
            ) {
                for (let i = 0; i < contentArr.length; i++) {
                    const element = contentArr[i];
                    if (element.includes("/")) {
                        var ttt = element.split("/");
                    } else {
                        var ttt = element.split("\\");
                    }
                    var kkk = ttt[ttt.length - 1];
                    if (getContentText.includes(kkk)) {
                        contentArr[i] = "";
                    }
                }

                const deleteArr = contentArr;
                const del_list_cookie = deleteArr.join(",");
                Cookies.set("del_list_cookie", del_list_cookie); // 혹시 모르니까 쿠키에 저장
                await axios
                    .post(
                        `${back_api}/editor/nosave_del`,
                        { deleteArr }
                    )
                    .then(() => {
                        Cookies.remove("del_list_cookie");
                    });
            } else {
                cancel();
            }
        }
    });

    // F5키를 누르는 경우 삭제할 이미지 리스트 쿠키 바로 저장
    function onKeyDown(e) {
        for (let i = 0; i < contentArr.length; i++) {
            const element = contentArr[i];
            if (element.includes("/")) {
                var ttt = element.split("/");
            } else {
                var ttt = element.split("\\");
            }
            var kkk = ttt[ttt.length - 1];
            if (getContentText.includes(kkk)) {
                contentArr[i] = "";
            }
        }
        if (e.keyCode == 116) {
            Cookies.set("del_list_cookie", contentArr);
        }
    }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="max_screen mx-auto px-2 pb-8 mt-2">
    <input
        type="text"
        class="py-2 mb-1 w-full rounded-sm border-gray-300 text-sm"
        placeholder="제목을 입력하세요"
        bind:value={subject}
    />

    <select
        class="py-2 mb-1 w-full rounded-sm border-gray-300 text-sm"
        bind:value={category}
    >
        <option value="">선택하세요</option>
        {#each categoryList as val}
            <option value={val}>{val}</option>
        {/each}
    </select>

    <Editor
        on:getEditorContent={getEditorContent}
        modifyVal={data.datas.get_content.bo_content}
        bind:contentArr
        height="500px"
    />

    <input
        type="text"
        class="py-2 mt-1 w-full rounded-sm border-gray-300 text-sm"
        placeholder="키워드를 입력하세요"
        bind:value={keyword}
    />

    <input
        type="text"
        class="py-2 mt-1 w-full rounded-sm border-gray-300 text-sm"
        placeholder="간략 설명을 입력하세요"
        bind:value={description}
    />

    <div class="mt-3 text-center">
        <button
            class="bg-sky-700 py-2 px-10 rounded-lg text-white suit-font"
            on:click={uploadContent}
        >
            등록하기
        </button>
    </div>
</div>
