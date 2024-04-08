<script>
    import { onMount, onDestroy } from "svelte";
    import axios from "axios";
    import { createEventDispatcher } from "svelte";
    import { browser } from "$app/environment";
    import { back_api } from "$src/lib/const";
    import { dataURItoBlob } from "$src/lib/lib";

    const dispatch = createEventDispatcher();

    let editor; // html 내 에디터를 표시한 부분
    let getImgUrl; // ??? 너는 뭐니???
    export let contentArr = []; // 새로 추가되는 컨텐츠 (이미지 / 비디오) 페이지에서 벗어나거나 할시 삭제할때 씀!
    let editorContent; // 에디터 본문
    let quill; // quill 에디터 본체!
    let nowRange; // 현재 라인
    let loading = false; // 이미지 업로드 시 spinner 돌아가게 로딩!!
    export let height;
    export let modifyVal; 
    let videoHandlerElement; // 비디오 핸들러 내가 만든거 element
    let videoHandlerElementShow = true; // 비디오 핸들러 보여지고~ 안보여지고~

    const imgExtList = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "tiff",
        "tif",
        "JPEG",
        "PNG",
        "GIF",
        "BMP",
        "WEBP",
        "TIFF",
    ];
    const imgChangeExtList = ["jpg", "jpeg", "png", "bmp", "tiff"];

    onMount(() => {
        let editorArea = document.querySelector(".ql-toolbar.ql-snow");
        if (editorArea) {
            editorArea.remove();
        }

        var img_fomat = Quill.import("formats/image");
        img_fomat.className = "inline-block";
        Quill.register(img_fomat, true);

        var BlockEmbed = Quill.import("blots/block");
        var Link = Quill.import("formats/link");

        class Video extends BlockEmbed {
            static create(value) {
                console.log(value);
                let node = super.create(value);
                node.setAttribute("frameborder", "0");
                node.setAttribute("allowfullscreen", true);
                if (!value.includes("youtube")) {
                    node.setAttribute("sandbox", ""); // 씨발!!!! 드디어 찾았다!!!!!!!!!!!
                }
                node.classList.add("ql-align-center");
                node.setAttribute("src", this.sanitize(value));
                return node;
            }

            static sanitize(url) {
                return Link.sanitize(url);
            }

            static value(domNode) {
                return domNode.getAttribute("src");
            }
        }
        Video.blotName = "video";
        Video.className = "ql-video";
        Video.tagName = "IFRAME";

        Quill.register({ "formats/video": Video });

        quill = new Quill(editor, {
            modules: {
                toolbar: {
                    container: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        [
                            {
                                color: [
                                    "#000000",
                                    "#e60000",
                                    "#ff9900",
                                    "#ffff00",
                                    "#008a00",
                                    "#0066cc",
                                    "#9933ff",
                                    "#ffffff",
                                    "#facccc",
                                    "#ffebcc",
                                    "#ffffcc",
                                    "#cce8cc",
                                    "#cce0f5",
                                    "#ebd6ff",
                                    "#bbbbbb",
                                    "#f06666",
                                    "#ffc266",
                                    "#ffff66",
                                    "#66b966",
                                    "#66a3e0",
                                    "#c285ff",
                                    "#888888",
                                    "#a10000",
                                    "#b26b00",
                                    "#b2b200",
                                    "#006100",
                                    "#0047b2",
                                    "#6b24b2",
                                    "#444444",
                                    "#5c0000",
                                    "#663d00",
                                    "#666600",
                                    "#003700",
                                    "#002966",
                                    "#3d1466",
                                    "custom-color",
                                ],
                            },
                        ],

                        [
                            { align: "" },
                            { align: "center" },
                            { align: "right" },
                            { align: "justify" },
                        ],
                        // [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image", "video", "code-block"],
                    ],
                    handlers: {
                        image: imageHandler,
                        video: videoHandler,
                    },
                },
            },

            theme: "snow",
            placeholder: "내용을 입력하세요",
        });

        // 이미지 핸들러 >> 이미지 선택되면 리사이징 / 업로드 / 이미지 배열 생성
        function imageHandler() {
            // input file tag 생성
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", ".png,.jpg,.jpeg,.gif,.webp");
            input.click();

            // input change
            input.onchange = async (e) => {
                loading = true;
                const maxWidth = 1200;
                const img_file = e.target.files[0];

                const img_name = img_file.name.split(".");
                const img_ext = img_name[img_name.length - 1];

                if (!imgExtList.includes(img_ext)) {
                    alert("이미지 형식이 아닙니다.");
                    loading = false;
                    return false;
                }

                if (imgChangeExtList.includes(img_ext)) {
                    const reader = new FileReader();
                    reader.readAsDataURL(img_file);

                    reader.onload = function (r) {
                        const img = new Image();
                        img.src = r.target.result;

                        img.onload = async function (e) {
                            if (img.width >= maxWidth) {
                                var share = img.width / maxWidth;
                                var setHeight = Math.floor(img.height / share);
                                var setWidth = maxWidth;
                            } else {
                                var setWidth = img.width;
                                var setHeight = img.height;
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

                            console.log(fileName);

                            imgForm.append("editorimg", resultImage, fileName);

                            // 컨텐츠 리스트에 이미지 링크 넣기

                            try {
                                getImgUrl = await axios.post(
                                    `${back_api}/editor/img_upload`,
                                    imgForm,
                                    {
                                        headers: {
                                            "Content-Type":
                                                "multipart/form-data",
                                        },
                                    },
                                );

                                const range = quill.getSelection();

                                quill.insertEmbed(
                                    range.index,
                                    "image",
                                    getImgUrl.data.baseUrl,
                                );

                                contentArr.push(getImgUrl.data.saveUrl);
                                contentArr = [...contentArr];

                                console.log(contentArr);

                                loading = false;
                                quill.insertText(range.index + 1, "\n\n");
                                quill.setSelection(range.index + 3);
                            } catch (error) {
                                alert("에러가 발생했습니다. 다시 시도해주세요");
                                loading = false;
                                return false;
                            }
                        };
                    };
                } else {
                    let imgForm = new FormData();

                    const timestamp = new Date().getTime();
                    const fileName = `${timestamp}${Math.random()
                        .toString(36)
                        .substring(2, 11)}.webp`;

                    imgForm.append("editorimg", img_file, fileName);

                    // 컨텐츠 리스트에 이미지 링크 넣기

                    try {
                        getImgUrl = await axios.post(
                            `${back_api}/editor/img_upload`,
                            imgForm,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            },
                        );

                        const range = quill.getSelection();

                        quill.insertEmbed(
                            range.index,
                            "image",
                            getImgUrl.data.baseUrl,
                        );

                        contentArr.push(getImgUrl.data.saveUrl);
                        contentArr = [...contentArr];
                        console.log(contentArr);

                        loading = false;
                        quill.insertText(range.index + 1, "\n\n");
                        quill.setSelection(range.index + 3);

                        // let timeoutId;
                        // timeoutId = setTimeout(() => {
                        // 	const editorContentWrap =
                        // 		editor.querySelector(".ql-editor");
                        // 	editorContentWrap.scrollTop =
                        // 		editorContentWrap.scrollHeight;
                        // }, 100);
                    } catch (error) {
                        alert("에러가 발생했습니다. 다시 시도해주세요");
                        loading = false;
                        return false;
                    }
                }
            };
        }

        // 비디오 버튼을 클릭하면 툴팁 나오게 하기
        function videoHandler() {
            const range = quill.getSelection();
            nowRange = range.index;
            videoHandlerElementShow = !videoHandlerElementShow;
        }

        // 글 수정시 서버에서 불러온 기본값(modifyVal) 에디터 안에 넣기
        const editorContentWrap = editor.querySelector(".ql-editor");

        const template = modifyVal;
        if (template) {
            editorContentWrap.innerHTML = template;
        }

        // 글 작성 및 에디터 내 액션 실행시 변수에 에디터 내 내용 저장
        quill.on("text-change", function (delta, source) {
            editorContent = quill.root.innerHTML;
            dispatch("getEditorContent", { editorContent });
        });

        // 비디오 핸들러 클릭하면 나오는 툴팁, 그 외 모든곳 클릭하면 해당 툴팁 사라지는 이벤트 등록 / 컨테이너 높이 반영

        document.addEventListener("click", closeVideoTooltip);
        const qlContainer = document.querySelector(".ql-container");
        qlContainer.style.height = height;

        const qlAlignList = document.querySelectorAll(".ql-align");
        for (let i = 0; i < qlAlignList.length; i++) {
            const element = qlAlignList[i];
            if (element.value == "center") {
                element.click();
            }
        }
    });

    // onDestroy 시에 비디오 핸들러 클릭하면 나오는 툴팁 이벤트 삭제
    onDestroy(async () => {
        if (browser) {
            document.removeEventListener("click", closeVideoTooltip);
        }
        // document.removeEventListener("click", closeVideoTooltip);
    });

    // 비디오 핸들러 켜져 있을시 외부 클릭하면 꺼지는 이벤트에 등록된 함수,
    function closeVideoTooltip(e) {
        if (e.target.closest(".ql-video")) {
            return;
        }
        if (!e.target.closest(".video-tooltip")) {
            videoHandlerElementShow = true;
        }
    }

    // 유튜브 업로드 버튼 클릭시 실행되는 함수
    async function youtubeUpload(editorIdx) {
        const youtubeInput = document.querySelector(".youtube-input");
        if (!youtubeInput.value) {
            alert("유튜브 링크가 없습니다. 링크를 확인해주세요");
            return false;
        } else if (!isYouTubeURL(youtubeInput.value)) {
            alert(
                '잘못된 형식입니다. 유튜브 영상 하단 "공유"버튼의 링크를 복사해서 붙여넣어주세요',
            );
            return false;
        }

        const youtubeId = extractVideoID(youtubeInput.value);
        const youtubeLink = `https://www.youtube.com/embed/${youtubeId}`;

        console.log(youtubeLink);
        console.log(quill);

        quill.insertEmbed(nowRange, "video", youtubeLink);
        quill.insertText(nowRange + 1, "\n");
        quill.setSelection(nowRange + 3);

        youtubeInput.value = "";
        videoHandlerElementShow = true;

        // let timeoutId;
        // timeoutId = setTimeout(() => {
        // 	const editorContentWrap = editor.querySelector(".ql-editor");
        // 	editorContentWrap.scrollTop = editorContentWrap.scrollHeight;
        // }, 100);
    }

    // 다이렉트 비디오 업로드 버튼 클릭시 함수
    async function directVideoUpload(editorIdx) {
        // input file tag 생성
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".mp4");
        input.click();
        input.onchange = async (e) => {
            if (e.target.files[0].size > 10000000) {
                alert(
                    "파일 사이즈가 너무 큽니다. 10MB 미만 파일만 업로드 가능합니다.",
                );
                return false;
            }
            let formData = new FormData();
            const config = {
                header: { "content-type": "multipart/form-data" },
            };
            const timestamp = new Date().getTime();
            const fileName = `${timestamp}${Math.random()
                .toString(36)
                .substring(2, 11)}.mp4`;
            formData.append("videofile", e.target.files[0], fileName);

            let getFile;
            try {
                getFile = await axios.post(
                    `${back_api}/editor/video_upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );

                contentArr.push(getFile.data.saveUrl);
                contentArr = [...contentArr];

                quill.insertEmbed(nowRange, "video", getFile.data.baseUrl);

                quill.insertText(nowRange + 1, "\n");

                quill.setSelection(nowRange + 3);

                videoHandlerElementShow = true;

                // const videoTooltip = document.querySelector(".video-tooltip");
                // videoTooltip.style.display = "none";

                // let timeoutId;
                // timeoutId = setTimeout(() => {
                // 	const editorContentWrap =
                // 		editor.querySelector(".ql-editor");
                // 	editorContentWrap.scrollTop =
                // 		editorContentWrap.scrollHeight;
                // }, 100);
            } catch (error) {
                alert("에러가 발생했습니다. 다시 시도해주세요");
                loading = false;
                return false;
            }
        };
    }

    // 유튜브 링크 검증 (영상 및 공유버튼 링크 형식이 맞는지)
    function isYouTubeURL(url) {
        var regex = /^https:\/\/youtu\.be\/.+$/;
        return regex.test(url);
    }

    // 유튜브 링크에서 아이디 추출함수
    function extractVideoID(url) {
        var regex = /\/([^/]+)$/; // 슬래시(/)로 시작하고, 슬래시(/)로 끝나지 않는 가장 마지막 부분을 찾는 정규식
        var match = url.match(regex); // 정규식과 일치하는 부분을 반환

        if (match && match.length > 1) {
            return match[1]; // 일치하는 부분 중 첫 번째 그룹을 반환 (마지막 부분)
        }

        return null; // 일치하는 부분이 없는 경우 null 반환
    }

    // 테이블 만들기 나중에 도전하자!!!
    function addTable() {
        console.log(quill);
        console.log(quill.root.innerHTML);
        const tempInnerHtml = quill.root.innerHTML;
        quill.root.innerHTML =
            tempInnerHtml +
            `
            <table>
                <tbody>
                <tr>
                    <td data-row="row-8bhm">제목은?</td>
                    <td data-row="row-8bhm">내용입니당</td>
                </tr>
                <tr>
                    <td data-row="row-w1ke">제목은?</td>
                    <td data-row="row-w1ke">내용입니당</td>
                </tr>
                <tr>
                    <td data-row="row-ih2n">제목은?</td>
                    <td data-row="row-ih2n">내용입니당</td>
                </tr>
                <tbody>
            </table>
            <p class="ql-align-center"></p>
            `;
    }

    if (browser) {
        document.addEventListener("click", tableSetting);
        function tableSetting(e) {
            if (e.target.tagName === "TD") {
                // 클릭한 요소가 <td>인 경우에 수행할 작업
                console.log("클릭한 요소는 <td> 입니다.");
            }
        }
    }
</script>

{#if loading}
    <div
        class="fixed left-0 top-0 w-full h-full bg-black z-50 opacity-30 flex justify-center items-center"
    >
        <div>
            <div role="status">
                <svg
                    aria-hidden="true"
                    class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
{/if}

<div class="main_container">
    <div class="text-right">
        <button
            type="button"
            class="px-2 py-0.5 bg-gray-100 border rounded-sm"
            on:click={addTable}
        >
            테이블 삽입
        </button>
    </div>
    <div class="editor-wrapper relative">
        <!-- Video Handlert 창 -->
        <div
            class="video-tooltip absolute top-9 left-[44%] z-50 p-2 border bg-white shadow-lg"
            bind:this={videoHandlerElement}
            class:hidden={videoHandlerElementShow}
        >
            <input
                type="text"
                class="border border-gray-300 rounded-lg px-2 py-1 in-video youtube-input focus:ring-0 text-xs"
                placeholder="유튜브 링크 입력"
            />
            <button
                type="button"
                class="ml-1 bg-blue-500 text-white py-1 px-2 rounded-md youtube-upload in-video text-xs"
                on:click={youtubeUpload}
            >
                등록하기
            </button>
            <div class="mt-2 text-center">
                <button
                    type="button"
                    class="w-full bg-gray-400 py-1 text-white rounded-lg in-video direct-video-upload text-sm"
                    on:click={directVideoUpload}
                >
                    직접 올리기
                </button>
                <div class="text-xs mt-1 in-video">
                    10MB 미만 / mp4 영상만 업로드 가능
                </div>
            </div>
        </div>

        <div bind:this={editor}></div>
    </div>
</div>

<style>
    @import "https://cdn.quilljs.com/1.3.6/quill.snow.css";
    :global(.ql-container) {
        position: relative;
    }

    :global(.ql-editor .ql-video) {
        min-width: 500px;
        min-height: 285px;
    }

    :global(.ql-editor img) {
        max-width: 85% !important;
    }

    @media (max-width: 547px) {
        :global(.video-tooltip) {
            left: 10px;
        }
    }
</style>
