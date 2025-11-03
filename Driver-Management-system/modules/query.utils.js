function buildQuery({ q }) {
    if (!q) return {};

    return { $text: { $search: q } };
  }
  
  function buildSort({ sort }) {
    if (!sort) return { createdAt: -1 }; 
    return sort.split(',').reduce((acc, key) => {
      key = key.trim();
      if (!key) return acc;
      if (key.startsWith('-')) acc[key.slice(1)] = -1;
      else acc[key] = 1;
      return acc;
    }, {});
  }
  
  function buildPaginate({ page = 1, limit = 10 }) {
    page = Math.max(1, parseInt(page, 10));
    limit = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }
  
  module.exports = { buildQuery, buildSort, buildPaginate };
  