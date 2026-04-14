import { Globe } from './components/Globe'
import { usePlateData } from './hooks/usePlateData'

function App() {
  const { data } = usePlateData(0)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Globe data={data} />
    </div>
  )
}

export default App
