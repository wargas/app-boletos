'use client'
import { ChevronsLeft, ChevronsRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"

export function PaginateBoletos({ pages }: { pages: number }) {
    const params = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const currentPage = parseInt(params.get('page') || '1')

    const pagesList = useMemo(() => {
        return Array(pages)
            .fill("1").map((_, p) => p + 1)
            .filter(p => pages < 8 || Math.abs(p - currentPage) <= 2)
    }, [currentPage, pages])

    const gotToPage = (page: string | number) => {
        const qs = new URLSearchParams(params)

        qs.set('page', page.toString())

        router.replace(`${pathname}?${qs.toString()}`, { scroll: false })
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem className="cursor-pointer">
                    <PaginationLink onClick={() => gotToPage(1)}>
                        <ChevronsLeft />
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem className="cursor-pointer">
                    <PaginationPrevious onClick={() => currentPage == 1 ? null : gotToPage(currentPage - 1)} />
                </PaginationItem>
                {pagesList[0] > 1 && (
                    <PaginationEllipsis />
                )}
                {pagesList.map((p) => (
                    <PaginationItem className="cursor-pointer" key={p}>
                        <PaginationLink isActive={p == currentPage} onClick={() => gotToPage(p)}>{p}</PaginationLink>
                    </PaginationItem>
                ))}
                {pagesList[pagesList.length - 1] < pages && (
                    <PaginationEllipsis />
                )}
                <PaginationItem className="cursor-pointer">
                    <PaginationNext onClick={() => currentPage == pages ? null : gotToPage(currentPage + 1)} />
                </PaginationItem>
                <PaginationItem className="cursor-pointer">
                    <PaginationLink onClick={() => gotToPage(pages)}>
                        <ChevronsRight />
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}