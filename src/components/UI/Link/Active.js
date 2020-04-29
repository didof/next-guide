import { useRouter } from 'next/router'

export default function Active({ children, href }) {
    const router = useRouter()

    const handle_click = e => {
        e.preventDefault()
        router.push(href)
    }

    return (
        <a href={href} onClick={handle_click}>
            {children}
        </a>
    )
}