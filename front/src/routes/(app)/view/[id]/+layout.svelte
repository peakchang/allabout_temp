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
    {#if $page.url.pathname.includes("view")}
        <SeoMeta bind:seoValue />
    {/if}
</svelte:head>

<slot />
