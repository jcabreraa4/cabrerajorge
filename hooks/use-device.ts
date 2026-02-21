import { useState, useEffect } from 'react';

const MOBILE_MAX = 767;
const TABLET_MIN = 768;
const TABLET_MAX = 1024;

export type Device = 'mobile' | 'tablet' | 'computer';

export function useDevice() {
  const getDevice = (): Device => {
    const width = window.innerWidth;
    if (width <= MOBILE_MAX) return 'mobile';
    if (width >= TABLET_MIN && width <= TABLET_MAX) return 'tablet';
    return 'computer';
  };

  const [device, setDevice] = useState<Device>(() => {
    if (typeof window === 'undefined') return 'computer';
    return getDevice();
  });

  useEffect(() => {
    function onResize() {
      setDevice(getDevice());
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return device;
}
