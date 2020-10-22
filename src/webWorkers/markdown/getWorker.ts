import Worker from 'worker-loader!./workerScript.ts';

export const getMarkedWorker = () => {
  if (!window.Worker) {
    console.error('Web workers are not supported');
    return null;
  }

  return new Worker();
};
