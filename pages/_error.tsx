import Link from 'next/link'
import Container from '../components/Container'

export default function ErrorPage () {
  return <Container>
    <h1>Ops... Error</h1>
    <Link href='/'><a>back to home</a></Link>
  </Container>
}
