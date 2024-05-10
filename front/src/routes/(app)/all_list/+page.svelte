<script>
    import axios from "axios";
    import { onMount, tick, beforeUpdate } from "svelte";
    import { afterNavigate, goto } from "$app/navigation";
    import { authStatus } from "$lib/store";

    import { invalidateAll } from "$app/navigation";
    import { back_api, siteName } from "$lib/const";

    import { extractFirstImageSrc } from "$lib/lib";
    import moment from "moment-timezone";

    import { page } from "$app/stores";

    import Cookies from "js-cookie";

    // console.log(Cookies.get("auth_status"));

    let chkModalVal = false;
    let pwdVal;
    let postNum = 10;
    let listStatus = true;
    let posts = [];
    let bannerSwiper;
    let loading = true;
    let pageArr = [];

    let getNowPage = 1;

    export let data;

    $: data, setData();
    function setData() {
        posts = data.posts;
        pageArr = data.pageArr;
        console.log(pageArr);
        if ($page.url.searchParams.get("page")) {
            getNowPage = $page.url.searchParams.get("page");
        }
    }

    afterNavigate(() => {
        invalidateAll();
    });
</script>

<div class="suit-font">
    <div
        data-sveltekit-preload-data="tap"
        data-sveltekit-reload
        class="grid grid-cols-2 md:grid-cols-4 suit-font gap-1"
    >
        {#each posts as post}
            <a
                href={post["bo_show_type"] == "view_board"
                    ? `/view/${post.bo_id}`
                    : `/board/${post.bo_id}`}
            >
                <div class="border rounded-md overflow-hidden">
                    <div
                        class="w-full h-32 overflow-hidden flex justify-center items-center"
                    >
                        {#if post.bo_main_img}
                            <img src={post.bo_main_img} alt="asdfasdf" />
                        {:else if extractFirstImageSrc(post.bo_content)}
                            <img
                                src={extractFirstImageSrc(post.bo_content)}
                                alt="asdfasdf"
                            />
                        {:else}
                            <img src="/no-image.png" alt="asdfasdf" />
                        {/if}
                    </div>

                    <div class="p-2 flex flex-col gap-2">
                        <!-- <div class="truncate">{post.bo_subject}</div> -->
                        <div class="text-xs">
                            {post.category} / {moment(
                                post.bo_created_at,
                            ).format("YY-MM-DD HH:mm")}
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>

    <div class="mt-3 mb-3">
        <ul
            class="flex justify-center gap-1 text-sm font-semibold"
            data-sveltekit-preload-data="tap"
        >
            <li>
                <button class="w-8 h-8 border rounded-md">
                    <i class="fa fa-chevron-left" aria-hidden="true"></i>
                </button>
            </li>

            {#each pageArr as page}
                {#if getNowPage == page}
                    <li>
                        <button
                            class="w-8 h-8 border rounded-md bg-blue-200"
                            value="1"
                        >
                            {page}
                        </button>
                    </li>
                {:else}
                    <li>
                        <a href="/all_list?page={page}">
                            <button class="w-8 h-8 border rounded-md" value="1">
                                {page}
                            </button>
                        </a>
                    </li>
                {/if}
            {/each}
            <li>
                <button class="w-8 h-8 border rounded-md">
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </button>
            </li>
        </ul>
    </div>
</div>
