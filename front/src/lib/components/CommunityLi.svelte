<script>
    import Badge from "$components/design/Badge.svelte";
    export let viewData = {}
    
</script>
<a href="/community/free/1">
    <li class="mb-3 w-full border-b">
        <div class="flex gap-2 md:gap-3 overflow-hidden">
            <div
                class="w-20 h-16 border rounded-md overflow-hidden flex justify-center items-center"
            >
            <img src={viewData.src} alt="" class="w-full h-full" />
            </div>

            <div class="flex flex-col justify-center w-[calc(100%-6rem)]">
                <div class="text-base ellipsis">도와주실분 찾습니다 ㅠ</div>
                <div class="text-sm font-light ellipsis-double md:pr-12">
                    사는게 이렇게 절박하고 어려운지 몰랐네요 ㅠ 이렇게 절박할줄
                    알았다면 조금이라도 더 열심히 살아보는건데 말예요 ㅠ
                </div>
            </div>
        </div>
        <div class="pt-2 pb-3 flex justify-between">
            <div>
                <span class="mr-2">
                    <Badge text="자유래디컬" color="blue" />
                </span>
                <span class="text-xs md:text-sm text-gray-500 mr-3">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                    5,891
                </span>
                <span class="text-xs md:text-sm text-gray-500">
                    <i class="fa fa-commenting-o" aria-hidden="true"></i>
                    5,891
                </span>
            </div>
            <div>
                <span class="text-xs md:text-sm text-gray-500 mr-3">
                    <i class="fa fa-clock-o" aria-hidden="true"></i>
                    23-11-24 17:43
                </span>
            </div>
        </div>
    </li>
</a>

<style>
    .ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; /* 말줄임 적용 */
    }

    .ellipsis-double {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
</style>
