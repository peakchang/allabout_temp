<script>
	import DrawerCustom from "$components/design/DrawerCustom.svelte";
	import { sineIn } from "svelte/easing";

	import { admin_sidebar, admin_sidebar_width } from "$src/lib/store";
	import { afterNavigate } from "$app/navigation";

	let innerWidth;
	let smallSidebar;

	let backdrop = true;
	const width = 208;

	console.log($admin_sidebar);

	$: {
		if (innerWidth < 1200) {
			$admin_sidebar = false;
			$admin_sidebar_width = false;
		} else {
			console.log("커짐요!");
			$admin_sidebar = true;
			$admin_sidebar_width = true;
		}
	}

	// afterNavigate(() => {
	//     if (innerWidth < 1200) {
	//         $admin_sidebar = false
	//     } else {
	//         $admin_sidebar = true
	//     }
	// });

	function changeDrawerOpt(bool) {}

	// 바탕을 클릭하면 액션을 줄지 말지
	let activateClickOutside = false;

	// 바탕을 클릭하면 drawer을 닫을지 말지
</script>


<svelte:window bind:innerWidth />

<div
	class="fixed top-0 left-0 w-full bg-stone-300 py-2 px-6 suit-font z-30 flex items-center pretendard"
	class:ml-52={$admin_sidebar && $admin_sidebar_width}
>
	<button on:click={() => ($admin_sidebar = !$admin_sidebar)}>
		<i class="fa fa-bars" aria-hidden="true"></i>
	</button>

	<a href="/" class="ml-10">
		<i class="fa fa-home text-xl" aria-hidden="true"></i>
	</a>

	<a href="/" class="ml-2"> 로그아웃 </a>
</div>

<DrawerCustom drawerOpen={$admin_sidebar} bgGray={false} {width}>
	<div class="flex justify-between mb-5">
		<div>Admin</div>
		<div>
			<button
				on:click={() => {
					$admin_sidebar = false;
				}}
			>
				<i class="fa fa-times" aria-hidden="true"></i>
			</button>
		</div>
	</div>

	<a href="/adm">
		<div class="p-2 text-base cursor-pointer mb-1.5">
			<span class="mr-2">
				<i class="fa fa-cog" aria-hidden="true"></i>
			</span>
			<span>기본설정</span>
		</div>
	</a>

	<a href="/adm/subdomain">
		<div class="p-2 text-base cursor-pointer mb-1.5">
			<span class="mr-2">
				<i class="fa fa-line-chart" aria-hidden="true"></i>
			</span>
			<span>서브도메인</span>
		</div>
	</a>
</DrawerCustom>

<div
	class="mt-14 px-2 text-sm suit-font"
	class:ml-52={$admin_sidebar && $admin_sidebar_width}
>
	<slot />
</div>

<style>
	:global(.suit-font) {
		font-family: "SUIT";
	}
</style>
