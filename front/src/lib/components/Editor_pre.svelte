<script>
    import { onMount, onDestroy } from "svelte";
    import axios from "axios";
    import { createEventDispatcher } from "svelte";
    import { browser } from "$app/environment";
    import { back_api } from "$src/lib/const";

    const dispatch = createEventDispatcher();

    let editor;
    let getImgUrl;
    export let contentArr = [];
    let getFolder = "";
    let editorContent;
    let quill;
    let nowRange;
    let loding = false;
    export let height;
    export let modifyVal;

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

    onMount(async () => {
        let editorArea = document.querySelector(".ql-toolbar.ql-snow");
        if (editorArea) {
            editorArea.remove();
        }
        // @ts-ignore
        const { default: Quill } = await import("quill");
        var img_fomat = Quill.import("formats/image");
        img_fomat.className = "inline-block";
        Quill.register(img_fomat, true);

        // ***********************************************

        var BlockEmbed = Quill.import("blots/block");
        var Link = Quill.import("formats/link");

        class Video extends BlockEmbed {
            static create(value) {
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

        // quill 에디터 불러오기
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

        quill.root.addEventListener("paste", function (e) {
            if (!e.target.classList.contains("ql-syntax")) {
                e.preventDefault();
                var pastedText = e.clipboardData.getData("text/plain");
                const TextLength = pastedText.length;
                let textArr = [];

                if (pastedText.includes("\r\n")) {
                    textArr = pastedText.split("\r\n");
                } else {
                    textArr = pastedText.split("\n");
                }

                for (let i = 0; i < textArr.length; i++) {
                    let lineTxt = textArr[i];
                    let lineEle = document.createElement("p");
                    lineEle.classList.add("ql-align-center");
                    if (
                        lineTxt.includes("http://") ||
                        lineTxt.includes("https://")
                    ) {
                        let linkElement = document.createElement("a");
                        linkElement.href = lineTxt;
                        linkElement.target = "_blank";
                        linkElement.rel = "noopener noreferrer";
                        linkElement.textContent = lineTxt;
                        lineEle.append(linkElement);
                    } else {
                        lineEle.innerText = lineTxt;
                    }

                    quill.root.append(lineEle);
                }

                setTimeout(() => {
                    quill.setSelection(TextLength + 4);
                }, 100);
            }
        });

        // 비디오 툴팁 (비디오 버튼을 클릭하면 나오는 작은 창) 함수 실행
        createVideoTooltip();

        // 이미지 핸들러 >> 이미지 선택되면 리사이징 / 업로드 / 이미지 배열 생성
        function imageHandler() {
            // input file tag 생성
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", ".png,.jpg,.jpeg,.gif,.webp");
            input.click();

            // input change
            input.onchange = async (e) => {
                loding = true;
                const maxWidth = 1200;
                const img_file = e.target.files[0];

                const img_name = img_file.name.split(".");
                const img_ext = img_name[img_name.length - 1];

                if (!imgExtList.includes(img_ext)) {
                    alert("이미지 형식이 아닙니다.");
                    loding = false;
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
                                    `${back_api}/editor/editor_img_upload`,
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

                                loding = false;
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
                                loding = false;
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

                        loding = false;
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
                        loding = false;
                        return false;
                    }
                }
            };
        }

        // 비디오 버튼을 클릭하면 툴팁 나오게 하기
        function videoHandler() {
            const range = quill.getSelection();
            nowRange = range.index;

            const videoTooltip = document.querySelector(".video-tooltip");
            if (
                !videoTooltip.style.display ||
                videoTooltip.style.display == "none"
            ) {
                videoTooltip.style.display = "block";
            } else {
                videoTooltip.style.display = "none";
            }
        }

        // 글 수정시 서버에서 불러온 기본값(modifyVal) 에디터 안에 넣기
        const editorContentWrap = editor.querySelector(".ql-editor");

        const template = modifyVal;
        if (template) {
            editorContentWrap.innerHTML = template;
        }

        // 글 작성 및 에디터 내 액션 실행시 변수에 에디터 내 내용 저장
        quill.on("text-change", function (delta, source) {
            editorContent = updateHtmlOutput();

            dispatch("getEditorContent", { editorContent });
        });

        // 비디오 핸들러 클릭하면 나오는 툴팁, 그 외 모든곳 클릭하면 해당 툴팁 사라지는 이벤트 등록 / 컨테이너 높이 반영
        if (browser) {
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
        }
    });

    // onDestroy 시에 비디오 핸들러 클릭하면 나오는 툴팁 이벤트 삭제
    onDestroy(async () => {

        // document.removeEventListener("click", closeVideoTooltip);
    });

    // 미사용
    const dataURItoBlob = (dataURI) => {
        const bytes =
            dataURI.split(",")[0].indexOf("base64") >= 0
                ? atob(dataURI.split(",")[1])
                : unescape(dataURI.split(",")[1]);
        const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
        const max = bytes.length;
        const ia = new Uint8Array(max);
        for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
        return new Blob([ia], { type: mime });
    };

    // 에디터 내용 변경시 실행되는 함수
    function getQuillHtml() {
        return quill.root.innerHTML;
    }
    function updateHtmlOutput() {
        let html = getQuillHtml();
        return html;
    }

    // 비디오 핸들러 켜져 있을시 외부 클릭하면 꺼지는 이벤트에 등록된 함수,
    function closeVideoTooltip(e) {
        if (browser) {
            try {
                // 먼저 해당 툴팁 선택
                const videoBtn = e.target.closest(".ql-video");
                if (videoBtn) {
                    return;
                }

                // 조건에 따라 툴팁 닫기
                if (
                    !e.target.classList.contains("in-video") &&
                    !e.target.classList.contains(videoBtn)
                ) {
                    const videoTooltip =
                        document.querySelector(".video-tooltip");
                    videoTooltip.style.display = "none";
                }

                // 유튜브 동영상 업로드 버튼 클릭시 액션
                if (e.target.classList.contains("youtube-upload")) {
                    youtubeUpload(nowRange);
                }

                // 다이렉트 동영상 업로드 버튼 클릭시 액션
                if (e.target.classList.contains("direct-video-upload")) {
                    directVideoUpload(nowRange);
                }
            } catch (error) {
                console.error(error.message);
            }
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

        quill.insertEmbed(nowRange, "video", youtubeLink);
        quill.insertText(nowRange + 1, "\n");
        quill.setSelection(nowRange + 3);
        const videoTooltip = document.querySelector(".video-tooltip");
        videoTooltip.style.display = "none";
        youtubeInput.value = "";

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

                const videoTooltip = document.querySelector(".video-tooltip");
                videoTooltip.style.display = "none";

                // let timeoutId;
                // timeoutId = setTimeout(() => {
                // 	const editorContentWrap =
                // 		editor.querySelector(".ql-editor");
                // 	editorContentWrap.scrollTop =
                // 		editorContentWrap.scrollHeight;
                // }, 100);
            } catch (error) {
                alert("에러가 발생했습니다. 다시 시도해주세요");
                loding = false;
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

    // 비디오 툴팁 디자인 함수
    function createVideoTooltip() {
        if (browser) {
            const qlContainer = document.querySelector(".ql-container");
            const newDiv = document.createElement("div");

            newDiv.classList.add(
                "video-tooltip",
                "shadow-lg",
                "in-video",
                "bg-white",
            );

            const videoInput = document.createElement("input");
            videoInput.placeholder = "유튜브 링크 입력";
            videoInput.classList.add(
                "border",
                "border-gray-300",
                "rounded-lg",
                "px-2",
                "py-1",
                "in-video",
                "youtube-input",
            );
            const ytbUpbtn = document.createElement("button");
            ytbUpbtn.classList.add(
                "ml-1",
                "bg-blue-500",
                "text-white",
                "py-1",
                "px-2",
                "rounded-md",
                "youtube-upload",
                "in-video",
            );
            ytbUpbtn.innerText = "등록하기";

            const directDiv = document.createElement("div");
            directDiv.classList.add("mt-2", "text-center");
            const directUpbtn = document.createElement("button");
            directUpbtn.classList.add(
                "w-full",
                "bg-gray-400",
                "py-1",
                "text-white",
                "rounded-lg",
                "in-video",
                "direct-video-upload",
            );
            directUpbtn.innerText = "직접 올리기";
            const infoDiv = document.createElement("div");
            infoDiv.classList.add("text-xs", "mt-1", "in-video");
            infoDiv.innerText = "10MB 미만 / mp4 영상만 업로드 가능";

            directDiv.appendChild(directUpbtn);
            directDiv.appendChild(infoDiv);

            newDiv.appendChild(videoInput);
            newDiv.appendChild(ytbUpbtn);
            newDiv.appendChild(directDiv);
            // newDiv.appendChild(newText);
            qlContainer.appendChild(newDiv);
        }
    }
</script>

{#if loding}
    <div
        class="fixed left-0 top-0 w-full h-full bg-black z-50 opacity-30 flex justify-center items-center"
    >
        <div>
        </div>
    </div>
{/if}

<div class="main_container">
    <div class="editor-wrapper">
        <div bind:this={editor} />
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

    :global(.video-tooltip) {
        padding: 10px;
        position: absolute;
        top: 0px;
        left: 44%;
        border: 1px solid #eaeaea;
        display: none;
    }

    @media (max-width: 547px) {
        :global(.video-tooltip) {
            left: 10px;
        }
    }
</style>
