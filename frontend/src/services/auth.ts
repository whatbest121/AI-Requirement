import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';

export const useRegister = () => {
    return useMutation({
        mutationFn: authApi.register
    });
}; 