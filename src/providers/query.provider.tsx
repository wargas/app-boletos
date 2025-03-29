'use client'
import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import { ComponentProps } from "react";

const queryClient = new QueryClient()


export function QueryProvider({ children }: ComponentProps<"div">) {

    return <QueryClientProvider client={queryClient} >
        {children}
    </QueryClientProvider>
}