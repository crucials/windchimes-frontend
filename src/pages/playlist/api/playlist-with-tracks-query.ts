import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { LOADED_TRACK_FRAGMENT } from '@/entities/tracks'
import {
    GetPlaylistWithTracksQuery,
    GetPlaylistWithTracksQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'

export function usePlaylistWithTracksQuery(
    playlistId: number,
    tracksToLoadIds?: number[],
) {
    return useQuery<GetPlaylistWithTracksQuery, GetPlaylistWithTracksQueryVariables>(
        gql`
            ${LOADED_TRACK_FRAGMENT}
            ${ERROR_FRAGMENT}

            query GetPlaylistWithTracks($playlistId: Int!, $tracksToLoadIds: [Int!]) {
                playlist(playlistId: $playlistId, tracksToLoadIds: $tracksToLoadIds) {
                    ... on PlaylistWithTracksGraphQL {
                        id
                        createdAt
                        name
                        pictureUrl
                        description
                        ownerUserId

                        tracksReferences {
                            id
                            platform
                            platformId
                        }

                        loadedTracks {
                            ...LoadedTrack
                        }
                    }

                    ... on ErrorGraphQL {
                        ...Error
                    }
                }
            }
        `,
        { playlistId, tracksToLoadIds },
    )
}
