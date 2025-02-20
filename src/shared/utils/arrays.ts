export interface ArrayPartIndices {
    startIndex: number
    endIndex: number
}

export function shuffle<TItem>(items: TItem[]) {
    const newItems = [...items]

    let currentIndex = newItems.length
    while (currentIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        const currentItem = newItems[currentIndex]
        const randomItem = newItems[randomIndex]

        newItems[randomIndex] = currentItem
        newItems[currentIndex] = randomItem
    }

    return newItems
}
