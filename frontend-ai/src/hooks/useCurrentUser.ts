import { useAuth } from '@/authentication/hook'
import useGetProfile from '@/api/services/user/useGetProfile'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function useCurrentUser() {
    const { isAuthenticated, auth } = useAuth()
    const { data: profile, refetch: refetchProfile, isLoading } = useGetProfile()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (isAuthenticated && auth.token && !profile) {
            refetchProfile()
        }
    }, [isAuthenticated, auth.token, profile, refetchProfile])

    const getUserId = (): string | null => {
        if (profile?._id) {
            return profile._id
        }
        return null
    }

    const getUsername = (): string | null => {
        if (profile?.username) {
            return profile.username
        }
        if (auth.user?.username) {
            return auth.user.username
        }
        return null
    }

    const clearUserData = () => {
        queryClient.removeQueries({ queryKey: ['useGetProfile'] })
    }

    return {
        isAuthenticated,
        user: profile,
        userId: getUserId(),
        username: getUsername(),
        isLoading,
        refetchProfile,
        clearUserData
    }
} 