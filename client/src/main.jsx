import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import {Toaster} from 'react-hot-toast'

import { PersistGate } from 'redux-persist/lib/integration/react.js'
import CustomThemeProvider from './components/CustomThemeProvider.jsx'
import { store, persistor } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor = {persistor} >
      <CustomThemeProvider>
        <App />
        <Toaster />
      </CustomThemeProvider>
    </PersistGate>
  </Provider>,
)
