<script>
    import Sortable from "sortablejs";
    import { onMount } from "svelte";
    import { admin_sidebar, testStoreArr } from "$src/lib/store";

    let sortableEle;
    let testArr = $testStoreArr;
    let number;

    // 이미지 추가 등 할때 처리 하기 (추가로 만져보자)
    function goaction() {
        const tempArr = [...testArr]
        tempArr.push(Number(number))
        testArr = [...tempArr]
        $testStoreArr = testArr;

    }

    onMount(() => {
        new Sortable(sortableEle, {
            //이동 시 부드러운 애니메이션 효과
            animation: 150,
            //요소 클릭(이동)중, ghostClass에 할당 된 값을 해당 요소의 Class명으로 부여
            ghostClass: "active",
            onEnd: function (evt) {
                $testStoreArr = arrChangeFunc(
                    $testStoreArr,
                    evt.oldIndex,
                    evt.newIndex,
                );
                console.log($testStoreArr);
            },
        });
    });

    function arrChangeFunc(getArr, oldIndex, newIndex) {
        const value = getArr[oldIndex];
        getArr.splice(oldIndex, 1);
        getArr.splice(newIndex, 0, value);
        return getArr;
    }
</script>

<div class="mt-14 px-5 suit-font" class:ml-52={!$admin_sidebar}>
    <div class="text-sm">
        <h1>drag and drop</h1>
        <ul class="cursor-pointer flex gap-1" bind:this={sortableEle}>
            {#each testArr as chk}
                <li class="w-14 h-14 border">list{chk}</li>
            {/each}
        </ul>
    </div>

    <div>
        <input type="text" bind:value={number}>
        <button
            class="bg-blue-700 text-white rounded-lg mt-5 py-1 px-3"
            on:click={goaction}
        >
            변경하기!
        </button>
        
        <button
            class="bg-orange-700 text-white rounded-lg mt-5 py-1 px-3"
            on:click={() => {
                console.log(testArr);
            }}
        >
            배열에 추가!
        </button>
    </div>
</div>
