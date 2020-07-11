import { FunctionComponent } from 'react'

interface ContainerProps {
}

const Container: FunctionComponent<ContainerProps> = (props) => {
  return <div style={{
    color: '#eee',
    background: '#222',
    fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    height: '100vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <div>
      <style jsx global>{`
        a:link {
          color: #eee;
        }
        a:visited {
          color: #ddd;
        }
        a:hover {
          color: #222;
          text-decoration: none;
          background: #eee;
        }
        a:active {
          color: orange;
        }
        h2, h3, h4, h5, h6 {
          display: inline;
        }
      `}</style>
      <style>{'body { margin: 0 }'}</style>
      {props.children}
    </div>
  </div>
}

export default Container
