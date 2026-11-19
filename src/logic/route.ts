export type ParsedHash = {
  path: string;
  query: URLSearchParams;
};

export const parseHash = (hash: string): ParsedHash => {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const queryStart = raw.indexOf('?');
  const rawPath = queryStart === -1 ? raw : raw.slice(0, queryStart);
  const rawQuery = queryStart === -1 ? '' : raw.slice(queryStart + 1);

  return {
    path: rawPath.replace(/^\/+|\/+$/g, ''),
    query: new URLSearchParams(rawQuery),
  };
};

export const buildHash = (path: string, query?: Record<string, string>): string => {
  const search = query ? new URLSearchParams(query).toString() : '';
  return `#/${path}${search ? `?${search}` : ''}`;
};
