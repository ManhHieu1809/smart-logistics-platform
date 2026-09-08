import type { ThemeConfig } from 'antd';

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2563EB',
    colorLink: '#2563EB',
    colorSuccess: '#059669',
    colorWarning: '#EA580C',
    colorError: '#DC2626',

    colorText: '#0F172A',
    colorTextSecondary: '#475569',

    colorBgBase: '#FFFFFF',
    colorBgLayout: '#F8FAFC',
    colorBgContainer: '#FFFFFF',

    colorBorder: '#E2E8F0',
    colorBorderSecondary: '#F1F5F9',

    borderRadius: 8,

    fontFamily:
      "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

    fontSize: 14,

    controlHeightLG: 44,
  },

  components: {
    Button: {
      primaryShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
      fontWeight: 600,
      borderRadius: 8,
    },

    Input: {
      activeBorderColor: '#2563EB',
      hoverBorderColor: '#3B82F6',
      activeShadow: '0 0 0 3px rgba(37, 99, 235, 0.12)',
      borderRadius: 8,
    },

    Checkbox: {
      colorPrimary: '#2563EB',
      colorPrimaryHover: '#1D4ED8',
      borderRadius: 4,
    },

    Table: {
      headerBg: '#F8FAFC',
      headerColor: '#475569',
      rowHoverBg: '#F8FAFC',
      borderColor: '#E2E8F0',
    },

    Tag: {
      borderRadiusSM: 6,
    },
  },
};