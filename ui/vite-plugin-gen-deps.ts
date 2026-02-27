import { Plugin } from 'vite';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

export type Options = {
  source: string;
  out: string;
  beautify: boolean;
  includeDeps: string[]; // Dependencies to explicitly include. When empty, all included.
  includeDevDeps: string[]; // Dev dependencies to include. When empty, no dev deps included.
};

export type PkgLock = {
  name: string;
  version: string;
  lockfileVersion: number;
  packages: {
    [key: string]: {
      version: string;
      dependencies: {
        [key: string]: string;
      };
      devDependencies: {
        [key: string]: string;
      };
    };
  };
};

function optDefaults(opt: Partial<Options> = {}): Options {
  return {
    source: opt.source || path.resolve(process.cwd(), 'package-lock.json'),
    out: opt.out || path.resolve(process.cwd(), 'dist', 'deps.json'),
    beautify: opt.beautify || false,
    includeDeps: opt.includeDeps || [],
    includeDevDeps: opt.includeDevDeps || [],
  };
}

function extractDeps(pkglock: PkgLock, opt: Options): Record<string, string> {
  const deps = pkglock.packages['']?.dependencies || {};
  if (opt.includeDeps.length > 0) {
    for (const name in deps) {
      if (!opt.includeDeps.includes(name)) {
        delete deps[name];
      }
    }
  }
  opt.includeDevDeps.forEach((name) => {
    const devDeps = pkglock.packages['']?.devDependencies || {};
    if (devDeps[name]) {
      deps[name] = devDeps[name];
    }
  });
  return Object.entries(deps)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce(
      (attrs, [name, version]) => ({
        ...attrs,
        [name]: pkglock.packages[`node_modules/${name}`]?.version || version,
      }),
      {},
    );
}

export default function genDeps(opt: Partial<Options> = {}): Plugin {
  return {
    name: 'gen-deps',
    closeBundle(): Promise<void> {
      const options = optDefaults(opt);
      return Promise.resolve()
        .then(() => readFile(options.source, 'utf-8'))
        .then(JSON.parse)
        .then((pkglock) => extractDeps(pkglock, options))
        .then((deps) => (options.beautify ? JSON.stringify(deps, null, 2) : JSON.stringify(deps)))
        .then((content) => writeFile(options.out, content, 'utf-8'));
    },
  };
}
