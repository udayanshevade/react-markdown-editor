import Worker from 'worker-loader!./workerScript.ts';

export const getMarkedWorker = () => new Worker();
