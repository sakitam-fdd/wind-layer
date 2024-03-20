export const usePlayground = (cb1?: () => void, cb2?: () => void) => {
  const pause = () => {
    cb1?.();
  };

  const resume = () => {
    cb2?.();
  };

  return {
    pause,
    resume,
  };
};
