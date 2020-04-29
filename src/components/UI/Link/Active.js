import { useRouter } from 'next/router'

export default function Active({ children, href, as }) {
    const router = useRouter()

    const handle_click = e => {
        e.preventDefault()
        router.push(href, as)
    }

    return (
        <a onClick={handle_click}>
            {children}
        </a>
    )
}