import type { ThemeConfig } from 'antd';

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0F172A',

    colorText: '#1B1B1D',
    colorTextSecondary: '#45464D',

    colorBgBase: '#FFFFFF',
    colorBgLayout: '#F8FAFC',
    colorBgContainer: '#FFFFFF',

    colorBorder: '#CBD5E1',
    colorBorderSecondary: '#E2E8F0',

    borderRadius: 8,

    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

    fontSize: 14,

    controlHeightLG: 42,
  },

  components: {
    Button: {
      primaryShadow: 'none',
      fontWeight: 600,
    },

    Input: {
      activeBorderColor: '#0F172A',
      hoverBorderColor: '#64748B',
      activeShadow: '0 0 0 2px rgba(15, 23, 42, 0.08)',
    },

    Checkbox: {
      colorPrimary: '#0F172A',
      colorPrimaryHover: '#1E293B',
    },
  },
};