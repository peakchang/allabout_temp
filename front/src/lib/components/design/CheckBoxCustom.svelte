<script>
    export let value = "";
    export let group = "";
</script>

<label
    class="text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center mx-auto"
>
    <input
        type="checkbox"
        bind:group
        {value}
        class="w-4 h-4 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 mx-auto"
    />
</label>
