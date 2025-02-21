import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // // Route to create a task
  // @Post()
  // async createTask(@Body() taskData, @Request() req) {
  //   // Get user ID from the JWT token in the request
  //   return this.taskService.createTask(taskData, req.user._id); // Using '_id' for user ID from the decoded token
  // }

  @Post()
  async createTask(@Body() taskData, @Request() req) {
    console.log('Decoded User:', req.user); // Debugging

    if (!req.user || !req.user._id) {
      throw new BadRequestException('User ID is missing from request');
    }

    return this.taskService.createTask(taskData, req.user._id);
  }

  // Route to get all tasks for a user
  @Get()
  async getUserTasks(@Request() req) {
    // Get tasks for the logged-in user
    return this.taskService.getTasksByUser(req.user._id); // Use '_id' from the decoded JWT token
  }

  // Route to get a single task by ID
  @Get(':id')
  async getTaskById(@Param('id') id: string, @Request() req) {
    // Retrieve the task by its ID and user ID
    return this.taskService.getTaskById(id, req.user._id); // Use '_id' from the JWT token
  }

  // Route to update an existing task
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateData,
    @Request() req,
  ) {
    // Update the task using user ID and task ID
    return this.taskService.updateTask(id, req.user._id, updateData); // Using '_id' for user ID
  }

  // Route to delete a task
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Request() req) {
    // Delete the task by its ID and the user ID
    return this.taskService.deleteTask(id, req.user._id); // Using '_id' for user ID
  }
}
