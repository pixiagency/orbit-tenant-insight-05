import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  >
    <div className="w-full overflow-x-auto scrollbar-hide">
    <div className="flex justify-start xs:justify-end mt-2 xs:mt-0">
        <div className="flex justify-center min-w-fit px-1 sm:px-2 md:px-4">
          {props.children}
        </div>
      </div>
    </div>
  </nav>
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "flex flex-row items-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2 min-w-fit",
      className
    )}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("flex-shrink-0", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"button">

const PaginationLink = ({
  className,
  isActive,
  size = undefined,
  ...props
}: PaginationLinkProps) => (
  <button
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size: size || "sm",
      }),
      "min-w-[36px] h-9 xs:min-w-[40px] xs:h-10 sm:min-w-[44px] sm:h-10 md:min-w-[48px] md:h-10 lg:min-w-[52px] lg:h-11",
      "text-xs xs:text-sm sm:text-sm md:text-base",
      "font-medium",
      "transition-all duration-200",
      "hover:scale-105 active:scale-95",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(
      "gap-1 pl-2 pr-2.5 xs:pl-2.5 xs:pr-3 sm:pl-3 sm:pr-3.5 md:pl-3.5 md:pr-4",
      "rtl:pl-2 rtl:pr-2.5 xs:rtl:pl-2.5 xs:rtl:pr-3 sm:rtl:pl-3 sm:rtl:pr-3.5 md:rtl:pl-3.5 md:rtl:pr-4",
      "btn-icon",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
    <span className="hidden xs:inline text-xs sm:text-sm md:text-base">Previous</span>
    <span className="xs:hidden text-xs">Prev</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(
      "gap-1 pr-2 pl-2.5 xs:pr-2.5 xs:pl-3 sm:pr-3 sm:pl-3.5 md:pr-3.5 md:pl-4",
      "rtl:pr-2 rtl:pl-2.5 xs:rtl:pr-2.5 xs:rtl:pl-3 sm:rtl:pr-3 sm:rtl:pl-3.5 md:rtl:pr-3.5 md:rtl:pl-4",
      "btn-icon",
      className
    )}
    {...props}
  >
    <span className="hidden xs:inline text-xs sm:text-sm md:text-base">Next</span>
    <span className="xs:hidden text-xs">Next</span>
    <ChevronRight className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex h-9 w-9 xs:h-10 xs:w-10 sm:h-10 sm:w-10 md:h-10 md:w-10 lg:h-11 lg:w-11",
      "items-center justify-center",
      "text-muted-foreground",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
