<script>
    import DrawerCustom from "./design/DrawerCustom.svelte";
    import { page } from "$app/stores";

    import { sineIn } from "svelte/easing";
    import axios from "axios";
    import { goto } from "$app/navigation";
    import { user_info } from "$lib/store";

    export let drawerBool = false;
    let width = 300;

    // function goRegistFunc() {
    //     if (!$user_info) {
    //         loginChkPopupModalBool = true;
    //         const loginGo = confirm(
    //             "로그인 후 작성 가능합니다. 로그인 하시겠습니까?",
    //         );
    //         if (loginGo) {
    //             goto("/auth/login");
    //         }
    //         return;
    //     }

    //     if (Object.keys($regist_info).length > 4) {
    //         drawerBool = true;
    //         registPopupModalBool = true;
    //     } else {
    //         // @ts-ignore

    //         goto("/regist/step1");
    //     }
    // }

    // async function logoutAct() {
    //     axios
    //         .post(`${back_api}/auth/logout`, {}, { withCredentials: true })
    //         .then((res) => {
    //             alert("로그아웃 되었습니다.");
    //             $user_info = "";
    //             drawerBool = true;
    //         })
    //         .catch((err) => {
    //             console.error(err.message);
    //             drawerBool = true;
    //             alert("에러 발생 다시 시도해주세요!");
    //         });
    // }
</script>

<DrawerCustom bind:drawerOpen={drawerBool} {width}>
    <div class="flex items-center justify-between mb-2 pretendard">
        <div class="">
            {#if !$user_info}
                <img src="/logo.png" alt="" class="max-w-[80px]" />
            {:else}
                <a href="/my">
                    <div class="flex items-center gap-2">
                        <!-- <Avatar src={$user_info.profile} /> -->
                        <span>아바타</span>

                        <div>
                            {$user_info.nick}
                        </div>
                    </div>
                </a>
            {/if}
        </div>

        <button on:click={() => (drawerBool = false)}>
            <i class="fa fa-times" aria-hidden="true"></i>
        </button>

        <!-- <CloseButton
            on:click={() => (drawerBool = true)}
            class="mb-2 dark:text-white"
        /> -->
    </div>

    <div class="border-t pt-4 pretendard text-right">
        {#if !$user_info}
            <button
                class="bg-gray-500 text-white text-sm py-1 px-4 rounded-md"
                on:click={() => {
                    goto("/auth/login");
                }}
            >
                로그인
            </button>
            <button
                class=" bg-cyan-600 text-white text-sm py-1 px-4 rounded-md"
                on:click={() => {
                    goto("/auth/join");
                }}
            >
                상담사 신청
            </button>
        {:else}
            <button
                class="bg-green-500 text-white text-sm py-1 px-4 rounded-md"
                on:click={() => {
                    goto("/my");
                }}
            >
                내정보
            </button>
            <button class="bg-red-500 text-white text-sm py-1 px-4 rounded-md">
                로그아웃
            </button>
        {/if}
    </div>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="mt-5" on:click={() => (drawerBool = false)}>
        <a href="/land">
            <div class="p-2 text-base cursor-pointer mb-1.5 flex items-center">
                <span class="mr-2">
                    <svg
                        class="w-5 h-5 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1"
                            d="M3 1h12M3 1v16M3 1H2m13 0v16m0-16h1m-1 16H3m12 0h2M3 17H1M6 4h1v1H6V4Zm5 0h1v1h-1V4ZM6 8h1v1H6V8Zm5 0h1v1h-1V8Zm-3 4h2a1 1 0 0 1 1 1v4H7v-4a1 1 0 0 1 1-1Z"
                        />
                    </svg>
                </span>
                <span>분양현장</span>
            </div>
        </a>

        <a href="/sub" on:click={() => (drawerBool = false)}>
            <div class="p-2 text-base cursor-pointer mb-1.5 flex items-center">
                <span class="mr-2">
                    <svg
                        class="w-5 h-5 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 21"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1"
                            d="M10 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C17 15.4 17 16 16.462 16H3.538C3 16 3 15.4 3 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 10 3.464ZM4 3 3 2M2 7H1m15-4 1-1m1 5h1M6.54 16a3.48 3.48 0 0 0 6.92 0H6.54Z"
                        />
                    </svg>
                </span>
                <span>청약정보</span>
            </div>
        </a>

        <a href="/community" on:click={() => (drawerBool = false)}>
            <div class="p-2 text-base cursor-pointer mb-1.5 flex items-center">
                <span class="mr-2">
                    <svg
                        class="w-5 h-5 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
                            stroke="currentColor"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M15 11C15 13.038 12.761 15.5 10 15.5C7.239 15.5 5 13.038 5 11C5 12.444 15 12.444 15 11Z"
                            stroke="currentColor"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M7.06117 6.89466C7.05247 6.91839 7.04467 6.94243 7.03778 6.96675C7.0126 6.9658 6.9874 6.9658 6.96222 6.96675C6.95534 6.94243 6.94753 6.91839 6.93883 6.89466C6.95977 6.88062 6.98018 6.86579 7 6.85021C7.01982 6.86579 7.04023 6.88062 7.06117 6.89466ZM12.9622 6.96675C12.9553 6.94243 12.9475 6.91839 12.9388 6.89466C12.9598 6.88062 12.9802 6.86579 13 6.85021C13.0198 6.86579 13.0402 6.88062 13.0612 6.89466C13.0525 6.91839 13.0447 6.94243 13.0378 6.96675C13.0126 6.9658 12.9874 6.9658 12.9622 6.96675Z"
                            fill="currentColor"
                            stroke="currentColor"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </span>
                <span>커뮤니티</span>
            </div>
        </a>
    </div>
</DrawerCustom>
