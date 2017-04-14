import logger from '../../lib/logger';

const printCacheSummary = (count = 0, noCacheTime, cacheTime) => {
  const percent = Math.round((1 - cacheTime / noCacheTime) * 100);

  const summary =
    `${count} documents\n` +
    `${cacheTime}ms (cache) < ${noCacheTime}ms (no cache)\n` +
    `${percent}% faster with cache`;

  logger.info(summary);

  return percent;
};

export default printCacheSummary;
