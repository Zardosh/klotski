export function setIsSoundActive(isSoundActive) {
  localStorage.setItem('isSoundActive', isSoundActive);
}

export function getIsSoundActive() {
  localStorage.getItem('isSoundActive');
}
