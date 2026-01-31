import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch(e) { return null }
  })

  // Debug logs to understand session loss on reload (set only in dev)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Auth init - user present:', !!user, 'hasToken:', !!(user && user.token))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem('token', user.token)
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('Auth change - user present:', !!user, 'hasToken:', !!(user && user.token))
    }
  }, [user])

  // Monitor localStorage changes in dev to detect unexpected clears (helps debug reload issues)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    let last = localStorage.getItem('user');
    const handle = () => {
      const now = localStorage.getItem('user');
      if (now !== last) {
        console.log('Auth: localStorage.user changed - now present:', !!now, 'previously:', !!last);
        last = now;
      }
    };
    const poll = setInterval(handle, 1500);
    window.addEventListener('storage', handle);

    // Monkey-patch localStorage.removeItem in dev to log stack traces for clears (helps detectar quién borra la sesión)
    let originalRemove = null;
    if (typeof localStorage !== 'undefined') {
      originalRemove = localStorage.removeItem;
      try {
        localStorage.removeItem = function(key) {
          if (key === 'user' || key === 'token') {
            console.log('localStorage.removeItem called for', key, new Error().stack);
          }
          return originalRemove.apply(this, arguments);
        }
      } catch (e) {
        // ignore (some browsers lock localStorage in certain contexts)
      }
    }

    return () => { clearInterval(poll); window.removeEventListener('storage', handle); if (originalRemove) try { localStorage.removeItem = originalRemove } catch(e) {} };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    // API responde { status, data: { token } }
    const token = res && res.data && res.data.token ? res.data.token : (res && res.token)
    setUser({ token })
    return res
  }
  const register = async (fullName, email, password) => {
    return api.post('/auth/register', { fullName, email, password })
  }
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
