export const FB_PIXEL_ID = '2264653411019812';

export const pageview = () => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }
};

export const event = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', name, options);
  }
};

export const viewContent = (contentName: string, contentCategory: string, value?: number, currency = 'PEN') => {
  event('ViewContent', {
    content_name: contentName,
    content_category: contentCategory,
    currency,
    value,
  });
};

export const lead = (value?: number, currency = 'PEN') => {
  event('Lead', { currency, value });
};

export const purchase = (value: number, currency = 'PEN', contentIds?: string[]) => {
  event('Purchase', {
    currency,
    value,
    content_ids: contentIds,
  });
};
