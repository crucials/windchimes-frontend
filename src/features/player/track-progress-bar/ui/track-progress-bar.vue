<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { usePlayerStore } from '@/features/player'

const playerStore = usePlayerStore()
const { rewind } = playerStore
const { currentQueueItem, currentSecond } = storeToRefs(playerStore)
</script>

<template>
    <VSlider
        class="track-progress-slider"
        color="background-contrast"
        thumb-size="14"
        track-size="2"
        center-affix
        :min="0"
        :max="currentQueueItem?.track.secondsDuration"
        :model-value="currentSecond"
        @update:model-value="newSecondsValue => rewind(newSecondsValue)"
    />
</template>

<style scoped>
.track-progress-slider {
    width: 100%;
    margin-inline: 0 !important;
    height: 30px;
}
</style>
