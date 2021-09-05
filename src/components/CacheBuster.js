import React, { useState, useEffect } from 'react';
global.appVersion = process.env.REACT_APP_VERSION;

console.log('*****************version: ', global.appVersion);

const CacheBuster = (props) => {
  // const [loading, setLoading] = useState(true);
  const [isCurrentLatestVersion, setIsCurrentLatestVersion] = useState(false);
  // const [refreshCacheAndReload, setRefreshCacheAndReload] = useState(null);

  useEffect(() => {
    fetch('/meta.json')
      .then((response) => response.json())
      .then((meta) => {
        console.log('****************fetched meta: ', meta);

        const latestVersion = meta.version;
        const currentVersion = global.appVersion;

        const shouldForceRefresh = semverGreaterThan(
          latestVersion,
          currentVersion
        );
        if (shouldForceRefresh) {
          console.log(
            `We have a new version - ${latestVersion}. Should force refresh`
          );

          setIsCurrentLatestVersion(false);
        } else {
          console.log(
            `You already have the latest version - ${latestVersion}. No cache refresh needed.`
          );

          setIsCurrentLatestVersion(true);
        }
      });
  }, []);

  // versionA from `meta.json` - first param - latest version
  // versionB in bundle file - second param - current version
  const semverGreaterThan = (versionA, versionB) => {
    const versionsA = versionA.split(/\./g);

    const versionsB = versionB.split(/\./g);
    while (versionsA.length || versionsB.length) {
      const a = Number(versionsA.shift());

      const b = Number(versionsB.shift());
      // eslint-disable-next-line no-continue
      if (a === b) continue;
      // eslint-disable-next-line no-restricted-globals
      return a > b || isNaN(b);
    }
    return false;
  };

  const refreshCacheAndReload = () => {
    console.log('Clearing cache and hard reloading...');
    if (caches) {
      // Service worker cache should be cleared with caches.delete()
      caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
      });
    }
    // delete browser cache and hard reload
    window.location.reload(true);
  };

  return props.children({
    isCurrentLatestVersion,
    refreshCacheAndReload,
  });
};

export default CacheBuster;
