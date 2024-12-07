<script setup lang="ts">
import { computed } from 'vue'
import { PlaylistsListItemFragment } from '@/shared/model/graphql-generated-types/graphql'

const props = defineProps<{
    playlist: PlaylistsListItemFragment
}>()

const formattedCreationDate = computed(() =>
    new Date(props.playlist.createdAt).toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    }),
)

const link = computed(() => ({ name: 'playlist', params: { id: props.playlist.id } }))
</script>

<template>
    <VHover>
        <template #default="{ props }">
            <VCard
                v-bind="{ ...props, ...$attrs }"
                variant="flat"
                max-width="320px"
                class="playlist-card"
            >
                <RouterLink :to="link" class="text-surface-2">
                    <VImg
                        v-if="playlist.pictureUrl"
                        :src="playlist.pictureUrl"
                        rounded
                        tile
                        height="220px"
                        cover
                    />

                    <VSheet
                        v-else
                        color="surface-2"
                        height="220px"
                        width="100%"
                        class="d-flex justify-center align-center"
                    >
                        <VIcon
                            icon="mdi-playlist-music"
                            color="surface"
                            size="200px"
                        />
                    </VSheet>
                </RouterLink>

                <VCardItem class="pa-4 pb-0">
                    <VCardTitle class="mb-2">
                        <h3 class="text-h6 text-truncate">
                            {{ playlist.name }}
                        </h3>
                    </VCardTitle>

                    <VCardSubtitle opacity="0.4">
                        {{ playlist.tracksCount }} tracks ·
                        <time
                            :datetime="playlist.createdAt"
                            :title="new Date(playlist.createdAt).toLocaleString()"
                        >
                            {{ formattedCreationDate }}
                        </time>
                    </VCardSubtitle>
                </VCardItem>

                <VCardActions class="pa-4 gc-1">
                    <slot name="append-playlist-action-buttons"></slot>

                    <VBtn
                        variant="text"
                        color="primary"
                        append-icon="mdi-arrow-right"
                        :to="link"
                    >
                        Open
                    </VBtn>
                </VCardActions>
            </VCard>
        </template>
    </VHover>
</template>
