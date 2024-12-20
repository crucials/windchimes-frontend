<script setup lang="ts">
import { ref } from 'vue'
import { TrackItem } from '@/entities/tracks'
import { QueueItem } from '@/entities/tracks-queue/model/queue-item'
import { LoadedTrackFragment } from '@/shared/model/graphql-generated-types/graphql'
import SwipableElement from '@/shared/ui/swipable-element.vue'
import DragAndDropItem from '@/shared/ui/drag-and-drop/drag-and-drop-item.vue'

defineProps<{
    track: LoadedTrackFragment
    trackNumber: number
    currentTrack: boolean
    allQueueTracks: QueueItem[]
}>()

const emit = defineEmits<{
    (event: 'move-before', itemToMoveId: string, beforeItemId: string): void
    (event: 'delete'): void
}>()

const dragged = ref(false)
</script>

<template>
    <DragAndDropItem
        v-model:dragged="dragged"
        :id="`${track.id}`"
        :key="track.id"
        @move-before="
            (itemToMoveId: string, beforeItemId: string) =>
                emit('move-before', itemToMoveId, beforeItemId)
        "
    >
        <SwipableElement
            @swipe="emit('delete')"
            :swipe-enabled="!dragged && !currentTrack"
        >
            <TrackItem
                :track-number="trackNumber"
                :track="track"
                :all-playlist-tracks="allQueueTracks"
                compact
                class="pr-0"
            >
                <template #append>
                    <VBtn
                        v-show="!currentTrack"
                        title="Delete from queue"
                        variant="text"
                        size="32px"
                        icon
                        :class="{ 'd-none d-sm-block': !currentTrack }"
                        @click="emit('delete')"
                    >
                        <VIcon icon="mdi-playlist-remove" size="22px" />
                    </VBtn>
                </template>
            </TrackItem>

            <template #pop-up-on-swipe>
                <VIcon icon="mdi-delete" />
                Delete
            </template>
        </SwipableElement>
    </DragAndDropItem>
</template>

<style scoped></style>
