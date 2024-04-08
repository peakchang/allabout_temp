<script>
    export let text = "텍스트!!";
    export let color = "";
</script>

<div
    class="border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 font-medium inline-flex items-center justify-center px-2.5 py-0.5 text-xs bg-{color}-100 text-{color}-800 dark:bg-{color}-900 dark:text-{color}-300 rounded"
>
    <slot>{text}</slot>
</div>
