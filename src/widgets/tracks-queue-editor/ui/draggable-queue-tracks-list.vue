<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import DraggableQueueTrack from '@/widgets/tracks-queue-editor/ui/draggable-queue-track.vue'
import { TrackItem } from '@/entities/tracks'
import { moveQueueTracks, QueueTrackNotFoundError } from '@/entities/tracks-queue'
import { QueueItem } from '@/entities/tracks-queue/model/queue-item'
import { DragAndDropList } from '@/shared/ui/drag-and-drop'
import { LoadedTrackFragment } from '@/shared/model/graphql-generated-types/graphql'
import { DragAndDropError } from '@/shared/model/errors'

defineProps<{
    /**
     * actual tracks' data loaded with pagination (infinite scroll)
     */
    loadedTracks: LoadedTrackFragment[]
    currentTrackId: number | undefined
}>()

const allQueueTracks = defineModel<QueueItem[]>('allQueueTracks', { required: true })

function moveBeforeTrack(trackToMoveId: string, beforeTrackId: string) {
    try {
        allQueueTracks.value = moveQueueTracks(
            allQueueTracks.value,
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

function deleteTrack(id: number) {
    const trackIndex = allQueueTracks.value.findIndex(track => id === track.id)
    allQueueTracks.value.splice(trackIndex, 1)
}
</script>

<template>
    <DragAndDropList
        class="tracks-list"
        :items="loadedTracks"
        @move-before="moveBeforeTrack"
    >
        <RecycleScroller
            :items="loadedTracks"
            :item-size="100"
            key-field="id"
            page-mode
            v-slot="{ item, index }"
        >
            <DraggableQueueTrack
                :track="item"
                :track-number="index + 1"
                :current-track="currentTrackId === item.id"
                :all-queue-tracks="allQueueTracks"
                class="draggable-queue-track"
                @delete="deleteTrack(item.id)"
            />
        </RecycleScroller>

        <template #dragged-item="{ draggedItem, draggedItemIndex }">
            <TrackItem
                :track="draggedItem"
                :track-number="draggedItemIndex + 1"
                :all-playlist-tracks="allQueueTracks"
            />
        </template>
    </DragAndDropList>
</template>

<style scoped>
.tracks-list {
    min-height: 200px;
}
</style>
