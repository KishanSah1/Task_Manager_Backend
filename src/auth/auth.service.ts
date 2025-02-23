import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // Import UserService

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, // Inject UserService for user operations
    private jwtService: JwtService, // Inject JwtService for JWT generation
  ) {}

  async validateToken(token: string) {
    try {
      // Verify and decode the token
      const decoded = this.jwtService.verify(token);

      // Get user from database using decoded userId
      const user = await this.userService.findUserById(decoded.userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Return user data without sensitive information
      return {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      };
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  // Signup method to register a new user
  async signup(email: string, password: string, username: string) {
    // Check if the user already exists
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      // Return a proper error response if the user already exists
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // Create the new user with hashed password
    const newUser = await this.userService.createUser(
      email,
      password,
      username,
    );

    // Generate JWT token
    const token = this.jwtService.sign({ userId: newUser._id });

    // Return the user details and token
    return {
      message: 'User registered successfully',
      userId: newUser._id,
      token, // Include the token in the response
    };
  }

  // Login method to authenticate a user
  async login(email: string, password: string) {
    // Find the user by email
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      // Return a proper error response if the user is not found
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Check if the provided password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Return a proper error response if the password is incorrect
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = this.jwtService.sign({ userId: user._id });

    // Return the login success message with the token
    return { message: 'Login successful', token };
  }
}
