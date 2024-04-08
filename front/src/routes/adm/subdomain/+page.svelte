<script>
    import { admin_sidebar } from "$src/lib/store";
    import axios from "axios";
    import { back_api } from "$lib/const";
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Checkbox,
        Button,
        Modal,
        Label,
        Input,
    } from "flowbite-svelte";

    import { invalidateAll } from "$app/navigation";

    export let data;
    let formModal = false;
    let addSubdomainName = "";
    let subDomainList = [];
    $: data, setData();
    function setData() {
        console.log(data);
        subDomainList = data.subDomainList;
        console.log(subDomainList);
    }

    async function addSubdomain() {
        if (!addSubdomainName) {
            alert("서브도메인 명을 입력해주세요");
            return false;
        }

        try {
            const res = await axios.post(
                `${back_api}/subdomain/add_subdomain`,
                { addSubdomainName },
            );
            if (res.data.status) {
                alert("서브도메인 추가가 완료되었습니다. 내용을 추가해주세요");
                formModal = false;
                addSubdomainName = "";
                invalidateAll();
            }
        } catch (error) {}
        console.log("alsidjfliasjdf");
    }
</script>

<div>
    <div class="mb-5 text-right">
        <Button
            on:click={() => (formModal = true)}
            class="py-1 px-3"
            color="yellow"
        >
            서브도메인 추가
        </Button>
    </div>

    <Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
        <Label class="space-y-2">
            <span>서브도메인(영문)을 입력해주세요</span>
            <Input
                required
                class="focus:ring-0"
                bind:value={addSubdomainName}
            />
        </Label>
        <Button
            type="submit"
            class="w-full py-2"
            color="blue"
            on:click={addSubdomain}
        >
            Login to your account
        </Button>
    </Modal>

    <Table hoverable={true}>
        <TableHead>
            <TableHeadCell class="border w-14 !p-0">
                <Checkbox class="mx-auto" />
            </TableHeadCell>
            <TableHeadCell class="border !p-3">제목</TableHeadCell>
            <TableHeadCell class="border !p-3">서브도메인</TableHeadCell>
            <TableHeadCell class="border !p-3">
                <span class="sr-only">Edit</span>
                <span>수정</span>
            </TableHeadCell>
        </TableHead>
        <TableBody class="divide-y">
            {#each subDomainList as con}
                <TableBodyRow>
                    <TableBodyCell class="border !p-0">
                        <Checkbox class="mx-auto" />
                    </TableBodyCell>
                    <TableBodyCell class="border !p-1.5">
                        {con.sb_subject ? con.sb_subject : '제목이 없습니다.'}
                        
                    </TableBodyCell>
                    <TableBodyCell class="border !p-1.5">
                        {con.sb_domain}
                    </TableBodyCell>
                    <TableBodyCell class="border !p-1.5">
                        <a
                            href="/adm/subdomain/write?id={con.sb_id}"
                            class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                            Edit
                        </a>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>
