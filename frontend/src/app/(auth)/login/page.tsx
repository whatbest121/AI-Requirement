'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api';

const formSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            localStorage.setItem('token', data.access_token);
            router.push('/chat');
        },
        onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
            setError(error.response?.data?.detail || 'An error occurred');
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        loginMutation.mutate(values);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                                {loginMutation.isPending ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </Form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don&apos;t have an account?
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
} 