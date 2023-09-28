import { useRouter } from 'next/router'
import React from 'react'

function AccessDenied() {
  const router  = useRouter()
  return (
    <section className="flex items-center h-screen p-16 dark:bg-gray-900 dark:text-gray-100">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
            <div className="max-w-md text-center">
                <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
                    <span className="sr-only">Access Denied</span>403
                </h2>
                <p className="text-2xl font-semibold md:text-3xl">Sorry, you could not access this page.</p>
                <p className="mt-4 mb-8 dark:text-gray-400">The page you are trying to access has restricted access. Please login to your account or try again!</p>
                <button className="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-gray-900" onClick={() => router.push("/login")}>Login</button>
            </div>
        </div>
    </section>
  )
}

export default AccessDenied