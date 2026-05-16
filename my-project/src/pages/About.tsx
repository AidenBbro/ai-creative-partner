import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>关于页面</h1>
      <p>这是关于页面内容。</p>
      <Link to="/" style={{ display: 'inline-block', marginTop: '1rem' }}>
        返回首页
      </Link>
    </div>
  )
}
