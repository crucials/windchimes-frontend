import gql from 'graphql-tag'
import { type ApolloClient } from '@apollo/client/core'
import type { PlaylistTrack } from '@/entities/tracks'
import { ERROR_FRAGMENT } from '@/shared/api/error-fragment'
import type {
    GetTrackAudioFileUrlQuery,
    GetTrackAudioFileUrlQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export async function queryTrackAudioFile(
    client: ApolloClient<any>,
    track: PlaylistTrack,
) {
    const audioFileQuery = gql`
        ${ERROR_FRAGMENT}

        query GetTrackAudioFileUrl($trackToReadData: TrackAudioFileQueryInput!) {
            trackAudioFile(trackToReadData: $trackToReadData) {
                ... on TrackAudioFileGraphQL {
                    url
                }

                ... on ErrorGraphQL {
                    ...Error
                }
            }
        }
    `

    return await client.query<
        GetTrackAudioFileUrlQuery,
        GetTrackAudioFileUrlQueryVariables
    >({
        query: audioFileQuery,
        variables: {
            trackToReadData: {
                platform: track.platform,
                platformId: track.platformId,
                audioFileEndpointUrl: track.audioFileEndpointUrl,
            },
        },
    })
}
