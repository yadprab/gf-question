
  export function debounce<T extends (...args: any[]) => void>(func: T, delay = 1000) {
    let timerId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>): void => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }