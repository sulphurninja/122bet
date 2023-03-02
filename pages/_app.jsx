import '../styles/globals.css'
import { DataProvider } from '../store/GlobalState'

export default function App({ Component, pageProps }) {
  return (
    <DataProvider>
  <Component {...pageProps} />
  </DataProvider>
  ) 
}
