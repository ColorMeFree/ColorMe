export function track(name, props={}) {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(name, { props })
  }
}
