export class WorkerQueue<Task extends Record<string, unknown>> {
  private taskQueue: Array<Task>;
  private isProcessing: boolean;

  constructor(private readonly workerFunction: (params: Task) => void) {
    this.taskQueue = [];
    this.isProcessing = false;
  }

  enqueueTask(task: Task) {
    this.taskQueue.push(task);
    if (!this.isProcessing) this.processTask();
  }

  private processTask() {
    if (this.taskQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.taskQueue.shift() as Task;
    this.workerFunction(task);

    setTimeout(() => {
      this.processTask();
    }, 0);
  }
}
