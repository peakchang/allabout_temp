<script>
    import { fly, scale } from "svelte/transition";
    export let open = false;
    export let modalWidth = 600

    // 백그라운드 클릭 했을때 모달 닫힘
    function chkModalBack(e) {
        if (e.target.classList.contains("opacity-40")) {
            open = false;
        }
    }
</script>

<svelte:window on:click={chkModalBack} />

{#if open}
    <div
        class="fixed top-0 left-0 w-full h-full bg-gray-500 opacity-40"
        style="z-index: 890;"
    ></div>
    <div
        in:fly={{ y: -80, duration: 350 }}
        class="max-w-[95%] fixed top-[100px] left-1/2 transform translate-x-[-50%]  bg-white p-3 rounded-lg text-base"
        style="width: {modalWidth}px; z-index: 900;"
    >
        <div class="text-right">
            <button
                on:click={() => {
                    open = false;
                }}
            >
                <i class="fa fa-times" aria-hidden="true"></i>
            </button>
        </div>
        <slot>Default Button!</slot>
    </div>
{/if}
