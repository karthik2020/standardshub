(function () {
  'use strict';
  if (!navigator.modelContext) return;

  const controller = new AbortController();
  const { signal } = controller;
  const unregisterFns = [];

  const register = (name, description, inputSchema, execute) => {
    try {
      const unregister = navigator.modelContext.registerTool({
        name,
        description,
        inputSchema,
        execute,
      }, { signal });
      if (typeof unregister === 'function') unregisterFns.push(unregister);
    } catch (e) {
      console.error('WebMCP: failed to register tool', name, e);
    }
  };

  register('search_standards', 'Search accounting standards by code, title, or keyword.', {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query (e.g. "IAS 1", "Leases")' }
    },
    required: ['query']
  }, async (args) => {
    const query = String(args.query || '').trim().toLowerCase();
    if (!query) return { results: [], count: 0 };
    try {
      const res = await fetch('/llms.txt');
      if (!res.ok) throw new Error('Failed to fetch index');
      const text = await res.text();
      const lines = text.split('\n');
      const results = lines.filter(line => line.toLowerCase().includes(query)).slice(0, 10);
      return { results, count: results.length };
    } catch (e) {
      return { results: [], count: 0, error: String(e) };
    }
  });

  register('navigate_to_standard', 'Navigate the browser to a StandardsHub standard page.', {
    type: 'object',
    properties: {
      code: { type: 'string', description: 'Standard code (e.g. "IAS 1", "ASC 105")' }
    },
    required: ['code']
  }, async (args) => {
    const code = String(args.code || '').replace(/\s+/g, '').toLowerCase();
    if (!code) return { error: 'code is required' };

    const frameworkMap = [
      { prefix: 'ias', base: '/ias/ias' },
      { prefix: 'ifrs', base: '/ifrs/ifrs' },
      { prefix: 'ipsas', base: '/ipsas/ipsas' },
      { prefix: 'indas', base: '/indas/indas' },
      { prefix: 'ifrssustainability', base: '/ifrs/ifrssustainability' },
      { prefix: 'ifrspublications', base: '/ifrs/ifrspublications' },
      { prefix: 'ifrsforsmes', base: '/ifrs/ifrsforsmes' },
      { prefix: 'usgaap', base: '/usgaap/asc' },
      { prefix: 'ukgaap', base: '/ukgaap/ukgaap' },
      { prefix: 'asbe', base: '/asbe/asbe' },
      { prefix: 'aspe', base: '/aspe/aspe' },
      { prefix: 'ifric', base: '/ifrs/ifric' },
      { prefix: 'sic', base: '/ifrs/sic' },
      { prefix: 'asbj', base: '/asbj/asbj' },
      { prefix: 'hgb', base: '/hgb/hgb' },
      { prefix: 'drs', base: '/germany/drs' },
    ];

    const match = frameworkMap.find(m => code.startsWith(m.prefix));
    if (!match) return { error: 'Unknown standard code', code };

    const slug = code.slice(match.prefix.length);
    const url = match.base + slug;
    window.location.href = url;
    return { navigated: true, url };
  });

  register('get_current_page', 'Get information about the current StandardsHub page.', {
    type: 'object',
    properties: {},
    required: []
  }, async () => {
    return {
      path: window.location.pathname,
      href: window.location.href,
      title: document.title,
    };
  });

  window.addEventListener('beforeunload', () => {
    for (const fn of unregisterFns) { try { fn(); } catch (e) {} }
  });

  window.__webmcpCleanup = () => {
    controller.abort();
    for (const fn of unregisterFns) { try { fn(); } catch (e) {} }
  };
})();
