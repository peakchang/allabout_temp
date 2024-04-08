<script>
    import { page } from "$app/stores";

    import {
        afterNavigate,
        beforeNavigate,
        invalidate,
        invalidateAll,
    } from "$app/navigation";
    import { back_api, category_list, siteName } from "$src/lib/const";

    // invalidate 를 사용할때에는 인자로 링크가 들어가야함

    export let data;
    let category = "";
    let categoryType = "";
    let postList = [];

    console.log($page);

    $: data, setData();

    function setData() {
        category = data.category;
        categoryType = data.categoryType;
        console.log(category);
        postList = [...data.posts].reverse();
    }
</script>

<div class="max_screen mx-auto px-2 pb-8 mt-2">
    <h1 class="sr-only">{siteName} - {category}</h1>
    <div class="my-6 kbo-font text-2xl text-gray-700 text-center relative">
        {category} 최신글 리스트
    </div>

    <div
        data-sveltekit-preload-data="tap"
        data-sveltekit-reload
        class="grid grid-cols-2 md:grid-cols-4 suit-font gap-1"
    >
        {#each postList as post}
            <a href="/view/{post.bo_id}">
                <div class="border rounded-md overflow-hidden">
                    <div
                        class="w-full h-32 overflow-hidden flex justify-center items-center"
                    >
                        <img src={post.img_link} alt="asdfasdf" />
                    </div>

                    <div class="p-2 flex flex-col gap-2">
                        <!-- <div class="truncate">{post.bo_subject}</div> -->
                        <div class="text-xs">
                            {post.category} / {post.date_str}
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>

<!-- <a href="/view/{post.bo_id}">
    <div class="border rounded-md overflow-hidden">
        <div
            class="w-full h-32 overflow-hidden flex justify-center items-center"
        >
            <img src={post.img_link} alt="asdfasdf" />
        </div>

        <div class="p-2 flex flex-col gap-2">
            <div class="truncate">{post.bo_subject}</div>
            <div class="text-xs">
                {post.category} / {post.date_str}
            </div>
        </div>
    </div>
</a> -->

<style>
    .sr-only {
        position: absolute;
        overflow: hidden;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        border: 0;
        clip: rect(0, 0, 0, 0);
    }
</style>
