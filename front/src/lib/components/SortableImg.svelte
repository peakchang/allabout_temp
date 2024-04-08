<script>
    import axios from "axios";
    import { dataURItoBlob } from "$src/lib/lib";
    import Sortable from "sortablejs";
    import { onMount, onDestroy } from "svelte";
    import _cloneDeep from "lodash/cloneDeep";
    import _remove from "lodash/remove";
    import _find from "lodash/find";
    import { createEventDispatcher } from "svelte";
    import { back_api } from "$src/lib/const";
    import cryptoRandomString from "crypto-random-string";
    const dispatch = createEventDispatcher();

    const crypto = () => cryptoRandomString({ length: 10 });

    let listsEl; // sortable.js wrapper
    let sortableLists; // sortable.js 지정하는거 (걍 몰랑~~)

    export let modifyImageList = [];
    export let maxImgCount = 9999999;
    let imgArr = [];

    onMount(() => {
        if (modifyImageList) {
        }
        // For Lists
        sortableLists = new Sortable(listsEl, {
            group: "My Lists", // 한 목록에서 다른 목록으로 요소를 끌어오려면(DnD) 두 목록의 그룹 값이 같아야 합니다.
            handle: ".list", // 드래그 핸들이 될 요소의 선택자를 입력합니다.
            delay: 0, // 클릭이 밀리는 것을 방지하기 위해 약간의 지연 시간을 추가합니다.
            // animation: 0, // 정렬할 때 애니메이션 속도(ms)를 지정합니다.
            forceFallback: true, // 다양한 환경의 일관된 Drag&Drop(DnD)을 위해 HTML5 기본 DnD 동작을 무시하고 내장 기능을 사용합니다.
            animation: 150,
            onEnd: function (e) {
                reorder(e.oldIndex, e.newIndex);
            },
        });
    });

    onDestroy(() => {
        console.log("destroyed!!!!");
    });

    function reorder(oldIndex, newIndex) {
        const clone = _cloneDeep(imgArr[oldIndex]);
        imgArr.splice(oldIndex, 1);
        imgArr.splice(newIndex, 0, clone);
        console.log(imgArr);
        dispatch("updateImgeList", {
            imgArr,
        });
    }

    // 이미지 삭제시 파일에서 삭제 및 배열에서도 삭제
    async function deleteImg() {
        const dataId = this.getAttribute("data-id");
        const deleteData = _find(imgArr, { id: dataId });

        const getImgSplit = deleteData.src.split("/");
        const getFolder = getImgSplit[getImgSplit.length - 2];
        const getImgName = getImgSplit[getImgSplit.length - 1];

        try {
            const res = await axios.post(`${back_api}/editor/delete_img`, {
                getFolder,
                getImgName,
            });

            if (res.data.status) {
                _remove(imgArr, { id: dataId });
                imgArr = [...new Set(imgArr)];
                dispatch("updateImgeList", {
                    imgArr,
                });
            } else {
                alert("에러가 발생했습니다. 다시 시도해주세요");
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // 이미지를 선택하면 사이즈 변경 (최대 1200px) 및 webp 변경 후 업로드
    const onFileSelected = (e) => {
        if (imgArr.length >= maxImgCount) {
            alert(`최대 ${maxImgCount}개 이미지만 업로드 가능합니다.`);
            return false;
        }

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

                    // FormData의 key 값과 value값 찾기
                    // let keys = imgForm.keys();
                    // for (const pair of keys) {
                    //     console.log(`name : ${pair}`);
                    // }

                    // let values = imgForm.values();
                    // for (const pair of values) {
                    //     console.log(`value : ${pair}`);
                    // }

                    // console.log(getReImgUrl);
                    // console.log(fileName);

                    axios
                        .post(`${back_api}/editor/img_upload`, imgForm, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })
                        .then((res) => {
                            imgArr.push({
                                src: res.data.baseUrl,
                                id: crypto(),
                            });
                            imgArr = [...new Set(imgArr)];
                            dispatch("updateImgeList", {
                                imgArr,
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

<div class="p-2">
    <div class="flex flex-wrap" bind:this={listsEl}>
        {#each imgArr as img (img.id)}
            <div
                class="list border border-slate-400 w-24 h-24 rounded-lg flex items-center justify-center overflow-hidden mb-1 ml-1 relative"
            >
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span
                    class="absolute top-1 right-1 text-red-600 cursor-pointer"
                    data-id={img.id}
                    on:click={deleteImg}
                >
                    <i
                        class="fa fa-times-circle-o"
                        aria-hidden="true"
                        data-id={img.id}
                    ></i>
                </span>
                <div>
                    <img src={img.src} alt="" />
                </div>
            </div>
        {/each}
    </div>
</div>

<div id="app" class="pretendard mt-3">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="flex items-center">
        <button
            class="flex justify-center items-center gap-1 bg-green-600 py-1 px-3 rounded-md text-white text-sm"
            on:click={onFileSelected}
        >
            <i class="fa fa-file-image-o" aria-hidden="true"></i>
            이미지 업로드
        </button>
    </div>
</div>
