<script>
    import axios from "axios";
    import { dataURItoBlob } from "$src/lib/lib";
    import { back_api } from "$src/lib/const";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let typeName = ""; // 평면도 이름 (ex. 100㎡D 뭐 이딴거)
    export let typeCount = 0; // 반복문을 돌때 해당 컴포넌트의 index 값
    export let imgArr = [];
    console.log(imgArr);

    function deleteImg() {
        console.log(typeCount);
        console.log(this.value);
        dispatch("imgDel", {
            index: parseInt(this.value),
            typeCount,
        });
    }

    // 이미지를 선택하면 사이즈 변경 (최대 1200px) 및 webp 변경 후 업로드
    const addTypeImg = (e) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".png,.jpg,.jpeg");
        input.click();

        // input change
        input.onchange = async (e) => {
            const maxWidth = 1200;
            const img_file = e.target.files[0];
            const options = {
                maxSizeMB: 0.7,
                // maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            const reader = new FileReader();
            reader.readAsDataURL(img_file);
            reader.onload = function (r) {
                let setWidth = 0;
                let setHeight = 0;
                const img = new Image();
                img.src = r.target.result;
                img.onload = async function (e) {
                    if (img.width >= maxWidth) {
                        var share = img.width / maxWidth;
                        var setHeight = Math.floor(img.height / share);
                        var setWidth = maxWidth;
                    } else {
                        setWidth = img.width;
                        setHeight = img.height;
                    }

                    var canvas = document.createElement("canvas");
                    canvas.width = setWidth;
                    canvas.height = setHeight;
                    canvas.display = "inline-block";
                    canvas
                        .getContext("2d")
                        .drawImage(img, 0, 0, setWidth, setHeight);

                    var getReImgUrl = canvas.toDataURL("image/webp");

                    const resultImage = dataURItoBlob(getReImgUrl);

                    let imgForm = new FormData();

                    const timestamp = new Date().getTime();
                    const fileName = `${timestamp}${Math.random()
                        .toString(36)
                        .substring(2, 11)}.webp`;
                    imgForm.append("onimg", resultImage, fileName);

                    axios
                        .post(`${back_api}/editor/img_upload`, imgForm, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })
                        .then((res) => {
                            console.log(res.data);
                            console.log("이미지 업로드 완료우~~~");
                            dispatch("imgUpdate", {
                                imgUrl: res.data.baseUrl,
                                typeCount,
                            });
                        })
                        .catch((err) => {
                            console.error(err.message);
                        });
                };
            };
        };
    };
</script>

<div class="block md:flex border mb-1">
    <div
        class="border-r-0 md:border-r p-3 w-full md:w-1/4 flex flex-col justify-center md:items-center"
    >
        <div class="mb-1">
            <label>
                타입명 :
                <input
                    type="text"
                    class="w-32 max-w-full border focus:outline-none focus:border-orange-600 py-1 px-2 rounded-md mx-auto"
                    bind:value={typeName}
                />
            </label>
        </div>
        <div>
            <button
                class="py-1 px-3 text-xs bg-green-600 active:bg-green-700 text-white rounded-md w-24 max-w-full"
                on:click={addTypeImg}
            >
                이미지 추가
            </button>
        </div>
    </div>
    <div class="p-3 flex gap-1 md:w-3/4">
        {#if imgArr.length > 0}
            {#each imgArr as img, idx}
                <div
                    class="h-24 w-28 flex justify-center items-center overflow-hidden rounded-lg border relative"
                >
                    <button
                        class="absolute top-1 right-1 bg-white rounded-full"
                        value={idx}
                        on:click={deleteImg}
                    >
                        <svg
                            class="w-4 h-4 text-red-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    </button>
                    <img src={img} alt="" class="" />
                </div>
            {/each}
        {/if}
    </div>
</div>
