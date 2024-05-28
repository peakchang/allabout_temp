<script>
    import { authStatus } from "$lib/store";
    import { page } from "$app/stores";
    import SeoMeta from "$lib/components/SeoMeta.svelte";
    
    let seoValue = {};

    export let data;
    $: data, setData();
    function setData() {
        seoValue = data.seoValue;
    }
</script>

<svelte:head>
    <SeoMeta bind:seoValue />
</svelte:head>

<slot />
