import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedUser = createRouteMatcher([
    "/admin(.*)",
    "/saved-cars(.*)",
    "/reservations(.*)"
])

export default clerkMiddleware(async(auth,req)=>{
    const {userId} = await auth();
    if(!userId && isProtectedUser(req)){
        const {redirectToSignin} = await auth();
        return redirectToSignin();
    }
});

export const config = {
  matcher: [

    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};