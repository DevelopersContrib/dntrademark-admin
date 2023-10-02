import { options } from "@/lib/options"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function ServerPage() {
    const session = await getServerSession(options)

    if (!session) {
        redirect('/api/auth/signin?callbackUrl=/auth/admin')
    }

    return (
        <section className="flex flex-col gap-6">
            admin - logging in user only
        </section>
    )

}
