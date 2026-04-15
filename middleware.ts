import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    if (!token) {
      return NextResponse.next()
    }

    const selectedPlan = token.selectedPlan as string | undefined
    const subscriptionStatus = token.subscriptionStatus as string | undefined
    const checkoutStatus = token.checkoutStatus as string | undefined

    const isDashboardRoute = pathname.startsWith("/dashboard")
    const isCheckoutRoute = pathname.startsWith("/checkout")
    const isAuthRoute =
      pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup")

    const shouldForceInitialCheckout =
      selectedPlan &&
      selectedPlan !== "free" &&
      subscriptionStatus !== "active" &&
      checkoutStatus === "not_started"

    if (shouldForceInitialCheckout && isDashboardRoute) {
      return NextResponse.redirect(new URL("/checkout", req.url))
    }

    if (token && isAuthRoute) {
      if (shouldForceInitialCheckout) {
        return NextResponse.redirect(new URL("/checkout", req.url))
      }

      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (subscriptionStatus === "active" && isCheckoutRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        const isProtected =
          pathname.startsWith("/dashboard") || pathname.startsWith("/checkout")

        if (isProtected) {
          return !!token
        }

        return true
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/checkout", "/auth/signin", "/auth/signup"],
}