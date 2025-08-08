import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/Home'
import Album from './pages/Album'
import Playlist from './pages/Playlist'
import Admin from './pages/Admin'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      { path: 'album/:albumId', element: <Album /> },
      { path: 'playlist/:playlistId', element: <Playlist /> },
      { path: 'admin', element: <Admin /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
