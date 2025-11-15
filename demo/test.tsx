import type { RequestWithPlatformDevice } from '../../../types/request';

import BeautyAnimation from '../../components/beauty/components/BeautyAnimation';
import { getQueryParams } from '../../utils/request';

type PageProps = {
  title?: string;
  subtitle?: string;
};

const AnimationBeautyPremium = ({ title, subtitle }: PageProps) => (
  <BeautyAnimation title={title} subtitle={subtitle} />
);

export const getServerSideProps = (req: RequestWithPlatformDevice) => {
  const value = getQueryParams(req).data;

  let raw: string | undefined;

  if (typeof value === 'string') {
    raw = value;
  } else if (Array.isArray(value)) {
    const [first] = value;

    if (typeof first === 'string') {
      raw = first;
    }
  }

  let title: string | undefined;
  let subtitle: string | undefined;

  const variants: Array<string> = [];

  if (raw) {
    variants.push(raw, raw.replace(/\+/g, ' '));

    const dec = decodeURIComponent(raw);

    if (dec.length > 0) {
      variants.push(dec, dec.replace(/\+/g, ' '));
    }
  }

  for (const v of variants) {
    let obj: unknown;

    try {
      obj = JSON.parse(v) as unknown;
    } catch {
      obj = null;
    }

    if (obj && typeof obj === 'object') {
      const o = obj as Record<string, unknown>;

      if (typeof o.title === 'string') {
        title = o.title;
      }

      if (typeof o.subtitle === 'string') {
        subtitle = o.subtitle;
      }
    }
  }

  return { props: { title, subtitle } };
};

export const setPageSettings = () => ({
  navigation: {
    navigationData: {
      type: 'hidden',
    },
  },
});

export default AnimationBeautyPremium;
