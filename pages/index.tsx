import Container from '../components/Container'
import Link from 'next/link'

export default function IndexPage () {
  return <Container>
    <h1>Cinema Together</h1>
    <Link href='/chen'>
      <a>
        <h3>ChenChen</h3>
      </a>
    </Link>
    {' | '}
    <Link href='/cai'>
      <a>
        <h3>CaiCai</h3>
      </a>
    </Link>
  </Container>
}
