<script>
    export let replyList = [];
    console.log(replyList);
    

    const chkReplyList = testFunc(replyList);

    function testFunc(replyList) {
        for (let i = 0; i < replyList.length; i++) {
            const element = replyList[i];
            replyList[i]["hidden_ip"] = hideLastTwoSegments(
                replyList[i]["re_ip"]
            );
            replyList[i]['date'] = formatDate(replyList[i]['re_created_at']);
        }
        return replyList;
    }

    function hideLastTwoSegments(ipAddress) {
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

    function formatDate(date) {
        const year = String(date.getFullYear()).slice(2);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year} .${month} .${day}`;
    }
</script>

<!-- 댓글 -->

{#each chkReplyList as reply}
    <article class="mb-6 text-base bg-white rounded-lg dark:bg-gray-900">
        <footer class="flex justify-between items-center">
            <div class="flex items-center">
                <p
                    class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"
                >
                    <i class="fa-regular fa-circle-user text-xl" />&nbsp;&nbsp;
                    {reply.hidden_ip}
                </p>
                <p>/&nbsp;&nbsp;</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {reply.date}
                </p>
            </div>
            <button
                id="dropdownComment1Button"
                data-dropdown-toggle="dropdownComment1"
                class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                type="button"
            >
                .
                <span class="sr-only">Comment settings</span>
            </button>
            <!-- Dropdown menu -->
        </footer>
        <p class="text-gray-500 dark:text-gray-400">
            {@html reply.re_content}
        </p>
        <div class="flex items-center mt-2 space-x-4">
            <button
                type="button"
                class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
            >
                <i class="fa-regular fa-comment-dots" />&nbsp; Reply
            </button>
        </div>
    </article>
{/each}
<!-- 대댓글 -->

<!-- <article
    class="mb-6 ml-4 lg:ml-9 text-base bg-white rounded-lg dark:bg-gray-900"
>
    <footer class="flex justify-between items-center">
        <div class="flex items-center">
            <p
                class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"
            >
                <i class="fa-regular fa-circle-user text-xl" />&nbsp;&nbsp;
                Michael Gough
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
                <time datetime="2022-02-12" title="February 12th, 2022"
                    >Feb. 12, 2022</time
                >
            </p>
        </div>
        <button
            id="dropdownComment1Button"
            data-dropdown-toggle="dropdownComment1"
            class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            type="button"
        >
            .
            <span class="sr-only">Comment settings</span>
        </button>
    </footer>
    <p class="text-gray-500 dark:text-gray-400">
        Much appreciated! Glad you liked it ☺️
    </p>
    <div class="flex items-center mt-2 space-x-4">
        <button
            type="button"
            class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
        >
            <i class="fa-regular fa-comment-dots" />&nbsp; Reply
        </button>
    </div>
</article> -->
