import { describe, it, expect } from 'vitest';
import { extractVersionFromUrl } from '@/util/version';

describe('coreui', () => {
  describe('extractVersionFromUrl', () => {
    it('extracts coreui version string from the css asset link', () => {
      const url = 'https://cdn.jsdelivr.net/npm/@coreui/coreui@4.0.4/dist/css/coreui.min.css';
      expect(extractVersionFromUrl(url, 'coreui')).toEqual('4.0.4');
    });

    it('extracts font-awesome@4 version string from the css asset link', () => {
      const url = 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css';
      expect(extractVersionFromUrl(url, 'font-awesome')).toEqual('4.7.0');
    });

    it('extracts font-awesome@6 version string from the css asset link', () => {
      const url = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.0.0-beta2/css/fontawesome.min.css';
      expect(extractVersionFromUrl(url, 'fontawesome-free')).toEqual('6.0.0-beta2');
    });

    it('returns `n/a` when it can\'t extract the version', () => {
      expect(extractVersionFromUrl('foo', 'bar')).toEqual('n/a');
    });
  });
});
