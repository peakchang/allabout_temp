<script>
    import { admin_sidebar } from "$src/lib/store";
    import axios from "axios";
    import { back_api } from "$lib/const";
    import Editor from "$lib/components/Editor.svelte";
    import { beforeNavigate, goto, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    // @ts-ignore
    import Cookies from "js-cookie";

    let contentArr;
    let modifyVal;
    let content;

    let workStatus = false; // 값이 true 면 새로고침시 체크

    let subject;
    let category;

    const uploadContent = async () => {
        console.log();

        if (!subject) {
            alert("제목이 입력되지 않았습니다.");
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

        const getId = $page.url.searchParams.get('id');

        const res = await axios.post(`${back_api}/subdomain/write`, {
            subject,
            category,
            content,
            contentArr,
            getId,
        });

        if (res.data.status) {
            workStatus = false;
            alert("글 작성이 완료 되었습니다.");
            goto('/adm/subdomain')
        }
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

<svelte:window on:keydown={onKeyDown} />
<div class="mt-14 px-5 text-sm suit-font" class:ml-52={!$admin_sidebar}>
    <input
        type="text"
        class="py-2 mb-1 w-full rounded-sm border-gray-300 text-sm"
        placeholder="제목을 입력하세요"
        bind:value={subject}
    />
    <Editor
        on:getEditorContent={getEditorContent}
        {modifyVal}
        bind:contentArr
        height="500px"
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
