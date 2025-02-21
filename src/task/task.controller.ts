import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.schema';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  createTask(@Body() taskData: Partial<Task>) {
    return this.taskService.createTask(taskData);
  }

  @Get()
  getTasks() {
    return this.taskService.getTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskById(id);
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body() updateData: Partial<Task>) {
    return this.taskService.updateTask(id, updateData);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
