<script>
    import Editor from "$lib/components/Editor.svelte";
    import axios from "axios";
    import { beforeNavigate, goto, invalidateAll } from "$app/navigation";
    // @ts-ignore
    import Cookies from "js-cookie";
    import { back_api, category_list } from "$lib/const";
    import { page } from "$app/stores";

    let contentArr;
    let modifyVal;
    let content;

    let workStatus = false; // 값이 true 면 새로고침시 체크

    let subject;
    let category;
    let keyword;
    let description;
    let allData = {};

    const uploadContent = async (e) => {
        const type = e.target.value;
        console.log(type);
        if (!allData["bo_subject"] || !allData["bo_category"]) {
            alert("제목 or 카테고리 미선택! 선택해주세여");
            return false;
        }

        const getDbObj = category_list.find(
            (v) => v.link === allData["bo_category"],
        );

        const showType = getDbObj["db"];
        allData["bo_show_type"] = getDbObj["db"];

        // 지울 목록 찾기 (에디터에 없는 항목만 배열로 남겨놓기)
        for (let i = 0; i < contentArr.length; i++) {
            const element = contentArr[i];
            if (element.includes("/")) {
                var ttt = element.split("/");
            } else {
                var ttt = element.split("\\");
            }

            var kkk = ttt[ttt.length - 1];
            if (allData["bo_content"].includes(kkk)) {
                contentArr[i] = "";
            }
        }

        const res = await axios.post(`${back_api}/board/write`, {
            type,
            allData,
            showType,
            contentArr,
        });

        if (res.data.status) {
            workStatus = false;
            alert("글 작성이 완료 되었습니다.");
            goto("/");
        }
    };

    const getEditorContent = (e) => {
        allData["bo_content"] = e.detail.editorContent;
        if (!allData["bo_content"] || allData["bo_content"] == "<p><br></p>") {
            workStatus = false;
        } else {
            workStatus = true;
        }
    };

    beforeNavigate(async ({ from, to, cancel }) => {
        if (workStatus) {
            if (
                confirm(
                    "페이지에서 나가시겠습니까? 작성중인 문서는 삭제됩니다.",
                )
            ) {
                const deleteArr = contentArr;
                const del_list_cookie = deleteArr.join(",");
                Cookies.set("del_list_cookie", del_list_cookie); // 혹시 모르니까 쿠키에 저장
                await axios
                    .post(`${back_api}/editor/nosave_del`, { deleteArr })
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
        if (e.keyCode == 116) {
            Cookies.set("del_list_cookie", contentArr);
        }
    }
</script>

<!-- <input type="number" bind:value on:change={onChange}> -->
<svelte:window on:keydown={onKeyDown} />

<div>
    <input
        type="text"
        class="py-2 mb-1 w-full rounded-sm border-gray-300 text-sm"
        placeholder="제목을 입력하세요"
        bind:value={allData["bo_subject"]}
    />

    <select
        class="py-2 mb-1 w-full rounded-sm border-gray-300 text-sm"
        bind:value={allData["bo_category"]}
    >
        <option value="">선택하세요</option>
        {#each category_list as category}
            <option value={category.link}>{category.name}</option>
        {/each}
    </select>

    <Editor
        on:getEditorContent={getEditorContent}
        modifyVal={allData["bo_content"]}
        bind:contentArr
        height="500px"
    />

    <div class="mt-3 text-center">
        {#if $page.url.searchParams.get("id")}
            <button
                class="bg-sky-700 py-2 px-10 rounded-lg text-white suit-font"
                value="update"
                on:click={uploadContent}
            >
                등록하기
            </button>
        {:else}
            <button
                class="bg-sky-700 py-2 px-10 rounded-lg text-white suit-font"
                value="upload"
                on:click={uploadContent}
            >
                등록하기
            </button>
        {/if}
    </div>
</div>
