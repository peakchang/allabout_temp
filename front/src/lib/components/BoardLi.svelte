<script>
    export let imgLink = {}
</script>

<li class="flex gap-2 md:gap-3 mb-3 w-full overflow-hidden">
    <div
        class="w-20 h-16 border rounded-md overflow-hidden flex justify-center items-center"
    >
        <img src={imgLink.src} alt="" class="w-full h-full" />
    </div>

    <div class="flex flex-col w-[calc(100%-6rem)]">
        <div class="text-sm md:text-base truncate">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
            reiciendis maxime iusto repudiandae nisi possimus quidem repellat
            repellendus laboriosam enim similique nihil nam natus modi,
            provident iste, amet vitae vel!
        </div>
        <div class="text-xs md:text-sm font-light truncate ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
            assumenda beatae reiciendis quibusdam dolore porro reprehenderit,
            nihil magnam ducimus numquam inventore cupiditate quisquam iste
            laudantium tenetur, sapiente fuga doloribus quas.
        </div>
        <div>
            <span class="text-xs text-gray-500 mr-3">
                <i class="fa fa-eye" aria-hidden="true"></i>
                5,891
            </span>
            <span class="text-xs text-gray-500">
                <i class="fa fa-commenting-o" aria-hidden="true"></i>
                5,891
            </span>
        </div>
    </div>
</li>
