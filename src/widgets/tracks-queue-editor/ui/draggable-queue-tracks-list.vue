<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'

import DraggableQueueTrack from '@/widgets/tracks-queue-editor/ui/draggable-queue-track.vue'

import { TrackItem } from '@/entities/tracks'
import { QueueTrackNotFoundError, moveQueueTracks } from '@/entities/tracks-queue'
import { LoadedQueueItem, QueueItem } from '@/entities/tracks-queue/model/queue-item'

import { DragAndDropError } from '@/shared/model/errors'
import { DragAndDropList } from '@/shared/ui/drag-and-drop'

defineProps<{
    /**
     * actual tracks' data loaded with pagination (infinite scroll)
     */
    loadedQueueItems: LoadedQueueItem[]
    currentQueueItemId: number | undefined
}>()

const allQueueItems = defineModel<QueueItem[]>('allQueueItems', { required: true })

function moveBeforeTrack(trackToMoveId: string, beforeTrackId: string) {
    try {
        allQueueItems.value = moveQueueTracks(
            allQueueItems.value,
            +trackToMoveId,
            +beforeTrackId,
        )
    } catch (error) {
        if (error instanceof QueueTrackNotFoundError) {
            throw new DragAndDropError(error.message)
        }

        throw new DragAndDropError(`queue drag and drop failed: ${error}`)
    }
}

function deleteQueueItem(id: number) {
    allQueueItems.value = allQueueItems.value.filter(item => item.id !== id)
}
</script>

<template>
    <DragAndDropList
        :items="loadedQueueItems"
        class="tracks-list-wrapper"
        @move-before="moveBeforeTrack"
    >
        <RecycleScroller
            :items="loadedQueueItems"
            :item-size="100"
            key-field="id"
            class="tracks-list"
        >
            <template #default="{ item, index }">
                <DraggableQueueTrack
                    :queue-item="item"
                    :track-number="index + 1"
                    :current-track="currentQueueItemId === item.id"
                    :all-queue-items="allQueueItems"
                    class="draggable-queue-track"
                    @delete="deleteQueueItem(item.id)"
                />
            </template>

            <template #after>
                <slot name="list-end"></slot>
            </template>
        </RecycleScroller>

        <template #dragged-item="{ draggedItem, draggedItemIndex }">
            <TrackItem
                :track="draggedItem.track"
                :track-number="draggedItemIndex + 1"
                :all-playlist-tracks="allQueueItems.map(item => item.track)"
            />
        </template>
    </DragAndDropList>
</template>

<style scoped>
.tracks-list-wrapper {
    /* TODO: replace calc with something more readable */
    height: calc(100% - 56px - 12px);
}

.tracks-list {
    height: 100%;
}
</style>
