<script setup lang="ts">
import { computed } from 'vue'
import { TrackItem } from '@/features/track'
import { PlaylistTrack, TRACKS_PORTION_SIZE } from '@/entities/tracks'
import { ExcludeGraphQLError } from '@/shared/utils/exclude-graphql-error'
import type {
    GetPlaylistWithTracksQuery,
    TrackReferenceGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'
import PaginatedContent from '@/shared/ui/paginated-content.vue'

const props = defineProps<{
    playlist: ExcludeGraphQLError<GetPlaylistWithTracksQuery['playlist']>
}>()

const emit = defineEmits<{
    (event: 'load-more', tracksToLoadIds: number[]): void
}>()

function loadMoreTracks() {
    const lastLoadedIndex = props.playlist.loadedTracks.length - 1

    emit(
        'load-more',
        props.playlist.tracksReferences
            .slice(lastLoadedIndex + 1, lastLoadedIndex + TRACKS_PORTION_SIZE + 1)
            .map(trackReference => trackReference.id),
    )
}

const availableTracks = computed(() => {
    return props.playlist.loadedTracks.filter(track => track !== null)
})

/**
 * all playlist tracks include tracks that are not loaded via virtual scroll,
 * these are tracks references that have only track's id and platform
 */
const allPlaylistTracks = computed(() => {
    const tracksReferences: (TrackReferenceGraphQl | PlaylistTrack)[] = [
        ...props.playlist.tracksReferences,
    ]
    const unavailableTracksIds: number[] = []

    props.playlist.loadedTracks.forEach((loadedTrack, index) => {
        if (loadedTrack === null) {
            unavailableTracksIds.push(tracksReferences[index].id)
            return
        }

        const matchingTrackReferenceIndex = tracksReferences.findIndex(
            trackReference => trackReference.id === loadedTrack?.id,
        )

        if (matchingTrackReferenceIndex !== -1) {
            tracksReferences[matchingTrackReferenceIndex] = loadedTrack
        }
    })

    return tracksReferences.filter(
        trackReference => !unavailableTracksIds.includes(trackReference.id),
    )
})
</script>

<template>
    <PaginatedContent
        v-if="playlist.tracksReferences.length > 0"
        :total-items="playlist.tracksReferences.length"
        :items-loaded="playlist.loadedTracks.length"
        @load-more="loadMoreTracks"
    >
        <VList>
            <TrackItem
                v-for="(track, index) in availableTracks"
                :key="track.id"
                :track="track"
                :all-playlist-tracks="allPlaylistTracks"
                :track-number="index + 1"
            />
        </VList>
    </PaginatedContent>

    <VCard v-else elevation="0">
        <VCardText class="text-surface-4"> No tracks were added yet </VCardText>
    </VCard>
</template>

<style scoped></style>
