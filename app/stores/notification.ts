export const useNotificationStore = defineStore('notify', () => {
    const items = ref<any[]>([])
    const unread = computed(() => items.value.filter(i => !i.read).length)

    const push = (n: any) => items.value.unshift(n)
    const markAll = () => items.value.forEach(i => i.read = true)

    return { items, unread, push, markAll }
})