import '@testing-library/jest-dom';
import { vi } from 'vitest';

// mock chart.js to avoid canvas issues in tests
vi.mock('chart.js', () => ({
  Chart: vi.fn(),
  registerables: [],
}));

// mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    save: vi.fn(),
    addPage: vi.fn(),
    text: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    setFillColor: vi.fn(),
    rect: vi.fn(),
    setFont: vi.fn(),
  })),
}));

// mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock'),
  }),
}));

// global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// mock fetch for API tests
global.fetch = vi.fn();
