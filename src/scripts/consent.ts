// Small analytics consent bar: shown until the visitor chooses, reopened from the footer "Cookies" button.
const KEY = 'analytics'
const read = () => {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

document.addEventListener('astro:page-load', () => {
  const bar = document.querySelector<HTMLElement>('.consent')
  if (!bar) return
  bar.hidden = read() !== null
  bar.querySelectorAll<HTMLButtonElement>('button').forEach(b =>
    b.addEventListener('click', () => {
      const previous = read()
      try {
        localStorage.setItem(KEY, b.dataset.consent!)
      } catch {}
      bar.hidden = true
      if (b.dataset.consent === 'yes') {
        const w = window as unknown as { startAnalytics?: () => void; gtag?: (...a: unknown[]) => void; gaLoaded?: boolean }
        w.startAnalytics?.()
        if (w.gaLoaded) w.gtag?.('event', 'page_view', { page_location: location.href, page_title: document.title })
      } else if (previous === 'yes') location.reload()
    }),
  )
  document.querySelector('.cookies')?.addEventListener('click', () => (bar.hidden = false))
})
