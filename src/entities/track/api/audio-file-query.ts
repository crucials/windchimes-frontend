import gql from 'graphql-tag'
import { type ApolloClient } from '@apollo/client/core'
import type { PlaylistTrack } from '@/entities/track/model/track'
import {
    Platform,
    type GetTrackAudioFileUrlQuery,
    type GetTrackAudioFileUrlQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

export async function queryTrackAudioFile(
    client: ApolloClient<any>,
    track: PlaylistTrack,
) {
    const audioFileQuery = gql`
        query GetTrackAudioFileUrl($platform: Platform!, $platformId: String!) {
            trackAudioFileUrl(platform: $platform, platformId: $platformId)
        }
    `

    return await client.query<
        GetTrackAudioFileUrlQuery,
        GetTrackAudioFileUrlQueryVariables
    >({
        query: audioFileQuery,
        variables: {
            platform: Platform.Soundcloud,
            platformId: track.platformId,
        },
    })
}