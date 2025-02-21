import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  // Create a new task
  async createTask(taskData: Partial<Task>): Promise<Task> {
    return new this.taskModel(taskData).save();
  }

  // Get all tasks
  async getTasks(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  // Get a task by ID
  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  // Update a task by ID
  async updateTask(id: string, updateData: Partial<Task>): Promise<Task> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  // Delete a task by ID
  async deleteTask(id: string): Promise<Task> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return deletedTask;
  }
}
