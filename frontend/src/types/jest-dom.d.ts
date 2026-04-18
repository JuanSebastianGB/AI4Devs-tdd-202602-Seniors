import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R, T> extends jest.Matchers<R, T> {}
  }
}

export {};