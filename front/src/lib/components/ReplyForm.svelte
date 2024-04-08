<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let depth: string;
    export let replyId: number;
    export let placeholderMessage: string = "댓글을 입력해주세요";
    export let replyContent: string = "";
    export let replyType: string = 'regist';


    const dispatch = createEventDispatcher();
    const postReplyAct = () => {
        dispatch("postReply", {
            replyContent,
            depth,
            replyId,
            replyType
        });
    };
</script>

<form
    class="mb-6"
    on:submit|preventDefault={() => {
        postReplyAct();
    }}
>
    <div
        class="py-2 px-4 mb-2 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
        <label for="comment" class="sr-only"> Your comment </label>
        <textarea
            rows="6"
            class="px-0 w-full h-20 text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none resize-none"
            placeholder={placeholderMessage}
            bind:value={replyContent}
            required
        />
    </div>
    <button
        type="submit"
        class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
    >
        댓글 등록하기
    </button>
</form>
