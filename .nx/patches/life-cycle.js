"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeLifeCycle = void 0;
class CompositeLifeCycle {
  constructor(lifeCycles) {
    this.lifeCycles = lifeCycles;
  }
  async startCommand(parallel) {
    for (const l of this.lifeCycles) {
      if (l.startCommand) {
        await l.startCommand(parallel);
      }
    }
  }
  async endCommand() {
    for (const l of this.lifeCycles) {
      if (l.endCommand) {
        await l.endCommand();
      }
    }
  }
  async scheduleTask(task) {
    for (const l of this.lifeCycles) {
      if (l.scheduleTask) {
        await l.scheduleTask(task);
      }
    }
  }
  startTask(task) {
    console.log({ id: task.id, name: task.name, target: task.target, hash: task.hash, hashDetails: task.hashDetails });
    for (const l of this.lifeCycles) {
      if (l.startTask) {
        l.startTask(task);
      }
    }
  }
  endTask(task, code) {
    for (const l of this.lifeCycles) {
      if (l.endTask) {
        l.endTask(task, code);
      }
    }
  }
  async startTasks(tasks, metadata) {
    tasks.forEach((t) => {
      console.log({ id: t.id, name: t.name, target: t.target, hash: t.hash, hashDetails: t.hashDetails });
    });
    for (const l of this.lifeCycles) {
      if (l.startTasks) {
        await l.startTasks(tasks, metadata);
      }
      else if (l.startTask) {
        tasks.forEach((t) => l.startTask(t));
      }
    }
  }
  async endTasks(taskResults, metadata) {
    for (const l of this.lifeCycles) {
      if (l.endTasks) {
        await l.endTasks(taskResults, metadata);
      }
      else if (l.endTask) {
        taskResults.forEach((t) => l.endTask(t.task, t.code));
      }
    }
  }
  printTaskTerminalOutput(task, status, output) {
    for (const l of this.lifeCycles) {
      if (l.printTaskTerminalOutput) {
        l.printTaskTerminalOutput(task, status, output);
      }
    }
  }
  registerRunningTask(taskId, parserAndWriter) {
    for (const l of this.lifeCycles) {
      if (l.registerRunningTask) {
        l.registerRunningTask(taskId, parserAndWriter);
      }
    }
  }
  registerRunningTaskWithEmptyParser(taskId) {
    for (const l of this.lifeCycles) {
      if (l.registerRunningTaskWithEmptyParser) {
        l.registerRunningTaskWithEmptyParser(taskId);
      }
    }
  }
  appendTaskOutput(taskId, output, isPtyTask) {
    for (const l of this.lifeCycles) {
      if (l.appendTaskOutput) {
        l.appendTaskOutput(taskId, output, isPtyTask);
      }
    }
  }
  setTaskStatus(taskId, status) {
    for (const l of this.lifeCycles) {
      if (l.setTaskStatus) {
        l.setTaskStatus(taskId, status);
      }
    }
  }
  registerForcedShutdownCallback(callback) {
    for (const l of this.lifeCycles) {
      if (l.registerForcedShutdownCallback) {
        l.registerForcedShutdownCallback(callback);
      }
    }
  }
}
exports.CompositeLifeCycle = CompositeLifeCycle;
