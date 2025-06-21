function fakeGetName(name: string, delay: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Guest: ${name}`);
    }, delay);
  });
}

export { fakeGetName };
