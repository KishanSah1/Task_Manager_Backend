import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(taskData, userId: string): Promise<Task> {
    const newTask = new this.taskModel({ ...taskData, userId });
    return newTask.save();
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).exec();
  }

  async getTaskById(taskId: string, userId: string): Promise<Task | null> {
    return this.taskModel.findOne({ _id: taskId, userId }).exec();
  }

  async updateTask(
    taskId: string,
    userId: string,
    updateData,
  ): Promise<Task | null> {
    return this.taskModel
      .findOneAndUpdate({ _id: taskId, userId }, updateData, { new: true })
      .exec();
  }

  async deleteTask(taskId: string, userId: string): Promise<Task | null> {
    return this.taskModel.findOneAndDelete({ _id: taskId, userId }).exec();
  }
}
