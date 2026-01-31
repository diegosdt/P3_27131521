const api = {
  _fetch: async (path, opts = {}) => {
    const headers = opts.headers || {}
    const token = localStorage.getItem('token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
    // Force no-store for fetch in the browser to avoid conditional requests returning 304
    const finalOpts = Object.assign({}, opts, { headers, credentials: 'include', cache: opts.cache || 'no-store' })
    let res = await fetch(path, finalOpts)

    // If server responds 304 (Not Modified) some browsers return it when using cached responses;
    // treat 304 as a signal to re-request bypassing caches (do one retry) to obtain fresh JSON.
    if (res.status === 304) {
      const retryOpts = Object.assign({}, finalOpts, { cache: 'no-store', headers: Object.assign({}, finalOpts.headers, { 'Pragma': 'no-cache', 'Cache-Control': 'no-store' }) })
      res = await fetch(path, retryOpts)
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      let json
      try { json = JSON.parse(text) } catch (e) { json = { message: text } }
      const err = new Error(json.message || res.statusText)
      err.status = res.status
      err.body = json
      throw err
    }
    return res.status === 204 ? null : res.json()
  },
  post: (path, body) => api._fetch(path, { method: 'POST', body: JSON.stringify(body) }),
  get: (path) => api._fetch(path, { method: 'GET' }),
  put: (path, body) => api._fetch(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => api._fetch(path, { method: 'DELETE' })
}

export default api
