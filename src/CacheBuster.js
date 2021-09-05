import React, { useState, useEffect } from 'react';
global.appVersion = process.env.REACT_APP_VERSION;

const CacheBuster = (props) => {
  const [isCurrentAppLatestVersion, setIsCurrentAppLatestVersion] = useState(
    true
  );

  useEffect(() => {
    const fetchMeta = async () => {
      let res = await fetch('/meta.json');
      let meta = await res.json();

      const latestVersion = meta.version;
      const currentVersion = global.appVersion;

      console.log(
        '*****************current Version: ',
        currentVersion,
        ', latest Version: ',
        latestVersion
      );

      const shouldForceRefresh = semverGreaterThan(
        latestVersion,
        currentVersion
      );
      if (shouldForceRefresh) {
        console.log(
          `We have a new version - ${latestVersion}. Should force refresh`
        );

        setIsCurrentAppLatestVersion(false);
      } else {
        console.log(
          `You already have the latest version - ${latestVersion}. No cache refresh needed.`
        );

        setIsCurrentAppLatestVersion(true);
      }
    };

    fetchMeta();
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
    isCurrentAppLatestVersion,
    refreshCacheAndReload,
  });
};

export default CacheBuster;
