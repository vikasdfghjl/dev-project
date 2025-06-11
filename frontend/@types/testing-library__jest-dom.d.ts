import "jest-dom/extend-expect";
import "@testing-library/jest-dom";

declare global {
  namespace Vi {
    interface Assertion<T = any> {
      toBeInTheDocument(): void;
    }
  }
}
