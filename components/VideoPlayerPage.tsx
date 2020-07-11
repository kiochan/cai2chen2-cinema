import Container from './Container'
import { FunctionComponent, useEffect, useState, createRef } from 'react'
import { findDOMNode } from 'react-dom'
import Link from 'next/link'
import ReactPlayer from 'react-player'
import screenfull from 'screenfull'
import WebSocket from 'isomorphic-ws'
import config from '../config.json'

type CinemaViewer = 'cai' | 'chen'

interface VideoPlayerPagePtops {
  viewer: CinemaViewer;
}

const videoPath = '/videos/0.mp4'

const VideoPlayerPage: FunctionComponent<VideoPlayerPagePtops> = (props) => {
  const [playing, setPlaying] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<number>(0)
  const [played, setPlayed] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1)
  const [syncFlag, setSyncFlag] = useState<boolean>(true)
  const [reloadWS, setReloadWS] = useState<number>(0)
  const [wsHandle, setWsHandle] = useState<WebSocket | undefined>(undefined)

  useEffect(() => {
    const ws = new WebSocket(`ws://${config.host}:${config.wsPort}/`)

    let timer: any

    ws.addEventListener('open', function open () {
      setWsHandle(ws)
    })

    ws.addEventListener('message', function incoming (data: any) {
      if (data.data) {
        const obj = JSON.parse(data.data)
        if (typeof obj === 'object') {
          if (obj.viewer !== props.viewer) {
            setSyncFlag(false)
            if (typeof obj.played === 'number') {
              try {
                if ((window as any).__evil__ === undefined) {
                  (window as any).__evil__ = {}
                }
                (window as any).__evil__.played = obj.played
              } catch {}
            }
          }
        }
      }
    })

    ws.addEventListener('error', () => {
      setTimeout(() => {
        setReloadWS(reloadWS + 1)
      }, 1000)
    })

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [reloadWS])

  const playAndPause = () => {
    setPlaying(!playing)
  }

  const sync = () => {
    setSyncFlag(true)
    try {
      if (typeof (window as any).__evil__.played === 'number') {
        seek((window as any).__evil__.played)
      }
    } catch {}
  }

  const seek = (t: number, fromUser = true) => {
    if (fromUser || (!fromUser && syncFlag)) {
      const value = t
      console.log(ref.current)
      if (!isNaN(t) && ref.current) {
        console.log('seek to ' + value)
        ref.current.seekTo(value)
      }
      if (!fromUser) {
        setSyncFlag(false)
      }
    }
  }

  const ref = createRef<ReactPlayer>()

  return <Container>
    <h1>Cinema Together</h1>
    <div style={{ marginBottom: '1rem' }}>
      <ReactPlayer
        url={videoPath}
        playing={playing}
        onProgress={(p) => {
          setLoaded(p.loaded)
          setPlayed(p.played)
          if (wsHandle) {
            wsHandle.send(JSON.stringify({
              played, playing, viewer: props.viewer
            }))
          }
        }}
        volume={volume}
        ref={ref}
      />
    </div>
    <div style={{ marginBottom: '0', padding: '0' }}>
      <input type='range' style={{ width: '100%', padding: '0', margin: '0' }}
        value={played} max={1} min={0} step={0.0000001}
        onChange={(e) => {
          seek(parseFloat((e.target as HTMLInputElement).value))
        }}/>
    </div>
    <div style={{ marginTop: '0', marginBottom: '2rem', padding: '0 0' }}>
      <progress style={{ width: '100%', padding: '0', margin: '0' }} max={1} value={loaded}></progress>
    </div>
    <div style={{ marginBottom: '0.5rem' }}>
      <a onClick={playAndPause}>{playing ? 'PAUSE' : 'PLAY'}</a>
      <span style={{ marginLeft: '1rem', marginRight: '1rem' }}> | </span>
      <a>VOLUME </a>
      <input type='range' style={{ width: '10rem', padding: '0', margin: '0', top: '0.1rem', position: 'relative', display: 'inline' }}
        value={volume} max={1} min={0} step={0.0000001}
        onChange={(e) => {
          setVolume(parseFloat((e.target as HTMLInputElement).value))
        }}/>
      <span style={{ marginLeft: '1rem', marginRight: '1rem' }}> | </span>
      <a onClick={() => {
        const dom = findDOMNode(ref.current)
        if (dom) {
          (screenfull as any).request(dom) // WTF is this type?
        }
      }}>FULLSCREEN</a>
    </div>
    <div style={{ marginBottom: '2rem' }}>
      <a onClick={sync}>SYNC</a>
    </div>
    <Link href='/cai'>
      <a>return home</a>
    </Link>
  </Container>
}

export default VideoPlayerPage
