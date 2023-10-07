const NO_VERSION = 'n/a';

export function extractVersionFromUrl(url: string, tag: string): string {
  const matches = url.match(`/${tag}@(.*[0-9])/`);
  if (matches && matches[1] !== '') {
    return matches[1];
  }
  return NO_VERSION;
}

export function getVersionFromLinkElem(tag: string): string {
  const link = document.querySelector(`head link[href*="${tag}"]`);
  if (link && link instanceof HTMLLinkElement) {
    return extractVersionFromUrl(link.href, tag);
  }
  return NO_VERSION;
}
