<script>
    import { createEventDispatcher } from "svelte";
    import { user_info } from "$src/lib/store";
    import { back_api } from "$src/lib/const";
    import { invalidateAll } from "$app/navigation";
    import axios from "axios";

    export let replyList = [];
    export let reply;
    export let idx;

    const dispatch = createEventDispatcher();
    function openReplyAreaProp() {
        const type = this.value;
        dispatch("openReplyArea", {
            idx,
            reply,
            type,
        });
    }

    function replyModify() {
        const type = this.value;

        dispatch("openReplyArea", {
            idx,
            reply,
            type,
        });
    }

    async function replyDelete() {
        const chkReplyArr = replyList.filter(
            (val) => Number(val.re_parent_id) === Number(reply.re_id)
        );
        
        if (chkReplyArr.length != 0) {
            alert("대댓글이 달려있는 댓글인 수정만 가능합니다.");
            return;
        }

        if (!confirm("삭제하면 복구가 불가능합니다. 삭제하시겠습니까?")) {
            return;
        }

        try {
            const res = await axios.post(`${back_api}/board/delete_reply`, {
                replyId: this.value,
            });

            if (res.data.status == "fail") {
                alert("에러가 발생했습니다. 다시 시도해주세요.");
                return;
            } else {
                invalidateAll();
            }
        } catch (error) {}
    }
</script>

<div class="flex gap-2 px-2">
    {#if reply.re_depth == "reply"}
        <div class="ml-1 text-gray-400">
            <i class="fa-solid fa-l" />
        </div>
    {/if}

    <article class="bg-white rounded-lg dark:bg-gray-900">
        <footer class="flex justify-between items-center">
            <div class="flex items-center">
                {#if reply.mb_thumbnail}
                    <span
                        class="w-8 h-8 flex items-center overflow-hidden rounded-full mr-2"
                    >
                        <img src={reply.mb_thumbnail} alt="" class="" />
                    </span>
                {:else}
                    <span
                        class="inline-flex items-center mr-1 text-sm text-gray-900 dark:text-white"
                    >
                        <i class="fa-regular fa-circle-user text-xl mr-1" />
                    </span>
                {/if}

                <span
                    class="text-xs md:text-sm text-gray-600 dark:text-gray-400"
                >
                    <span class="mr-1">{reply.mb_nick}</span>
                    <span>{reply.mb_position ? reply.mb_position : ""}</span>
                </span>
                <span class="mx-1">/</span>
                <span
                    class="text-xs md:text-sm text-gray-600 dark:text-gray-400"
                >
                    {reply.date_str}
                </span>

                {#if $user_info && reply.re_user == $user_info.email}
                    <div class="ml-3">
                        <button
                            class="text-xs bg-blue-500 rounded-lg text-white active:bg-blue-600"
                            style="padding: 3px 13px;"
                            value="modify"
                            on:click={replyModify}
                        >
                            수정
                        </button>

                        <button
                            class="text-xs bg-red-500 rounded-lg text-white active:bg-red-600"
                            style="padding: 3px 13px;"
                            value={reply.re_id}
                            on:click={replyDelete}
                        >
                            삭제
                        </button>
                    </div>
                {/if}
            </div>
            <button
                id="dropdownComment1Button"
                data-dropdown-toggle="dropdownComment1"
                class="ml-2 inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                type="button"
            >
                .
                <span class="sr-only">Comment settings</span>
            </button>
            <!-- Dropdown menu -->
        </footer>
        <p class="text-sm md:text-base text-gray-500 dark:text-gray-400">
            {@html reply.re_content}
        </p>
        <div class="flex items-center mt-2 space-x-4">
            <button
                type="button"
                class="flex items-center text-xs md:text-sm text-gray-500 hover:underline dark:text-gray-400"
                value="regist"
                on:click={openReplyAreaProp}
            >
                <i class="fa-regular fa-comment-dots" />&nbsp; Reply
            </button>
        </div>
    </article>
</div>
