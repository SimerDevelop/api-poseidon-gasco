import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) { }

  @Post('create')
  async create(@Body() courseData: Course): Promise<Course> {     
    return this.coursesService.create(courseData);
  }

  @Get('all')
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get('getById/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.coursesService.findOne(id);
  }

  @Get('getByOperatorId/:id')
  async findCourseByOperatorId(@Param('id') id: string): Promise<any> {
    return this.coursesService.findCourseByOperatorId(id);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() roleData: Course): Promise<any> {
    return this.coursesService.update(id, roleData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.coursesService.remove(id);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.coursesService.delete(id);
  }

}
