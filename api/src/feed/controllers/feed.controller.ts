import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { DeleteResult, UpdateResult } from 'typeorm';

import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';
// import { Roles } from '../../auth/decorators/roles.decorator';
// import { Role } from '../../auth/models/role.enum';
// import { RolesGuard } from '../../auth/guards/roles.guard';
import { IsCreatorGuard } from '../../auth/guards/is-creator.guard';
@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}
  // @Roles(Role.ADMIN, Role.PREMIUM)
  // @UseGuards(JwtGuard, RolesGuard)
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() feedPost: FeedPost, @Request() req): Observable<FeedPost> {
    return this.feedService.createPost(req.user, feedPost);
  }
  // @Get()
  // findAll(): Observable<FeedPost[]> {
  //   return this.feedService.findAllPosts();
  // }

  @UseGuards(JwtGuard)
  @Get()
  findSelected(
    @Query('take') take = 1,
    @Query('skip') skip = 1,
  ): Observable<FeedPost[]> {
    take = take > 20 ? 20 : take;
    return this.feedService.findPosts(take, skip);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() feedpost: FeedPost,
  ): Observable<UpdateResult> {
    return this.feedService.updatePost(id, feedpost);
  }
  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.feedService.deletePost(id);
  }
}
